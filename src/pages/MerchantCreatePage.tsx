import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductRateTable, buildRateRows, type ProductRateRow } from '../components/ProductRateTable';

interface MerchantDraft { id: string; owner: string; channels?: string[]; settlementBank?: string; }
const OPERATOR = 'Ops User';
const DRAFT_KEY = 'merchant-drafts';

const enterpriseOptions = [
  { id: 'ent-1', cid: 'CID-101', name: 'HK Food Group' },
  { id: 'ent-2', cid: 'CID-104', name: 'Approved Active Co' }
];

const shopOptions = [
  { id: 'shop-1', sid: 'SID-10001', name: '尖沙咀旗舰店', enterpriseId: 'ent-1' },
  { id: 'shop-2', sid: 'SID-10002', name: '旺角站前店', enterpriseId: 'ent-1' },
  { id: 'shop-3', sid: 'SID-10003', name: '中环金融中心店', enterpriseId: 'ent-2' }
];

export const MerchantCreatePage = () => {
  const [form] = Form.useForm();
  const [rates, setRates] = useState<ProductRateRow[]>(buildRateRows());
  const [draftOpen, setDraftOpen] = useState(false);
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [draftKeyword, setDraftKeyword] = useState('');
  const [enterpriseKeyword, setEnterpriseKeyword] = useState('');
  const [shopKeyword, setShopKeyword] = useState('');
  const nav = useNavigate();
  const channels: string[] = Form.useWatch('channels', form) || [];
  const enterpriseId = Form.useWatch('enterpriseId', form);

  const drafts = useMemo<MerchantDraft[]>(() => JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: MerchantDraft) => x.owner === OPERATOR), []);
  const filteredDrafts = useMemo(() => drafts.filter((x) => !draftKeyword || x.id.includes(draftKeyword)), [draftKeyword, drafts]);
  const filteredEnterprises = useMemo(() => enterpriseOptions.filter((x) => !enterpriseKeyword || x.cid.includes(enterpriseKeyword) || x.name.toLowerCase().includes(enterpriseKeyword.toLowerCase())), [enterpriseKeyword]);
  const filteredShops = useMemo(() => shopOptions.filter((x) => (!enterpriseId || x.enterpriseId === enterpriseId) && (!shopKeyword || x.sid.includes(shopKeyword) || x.name.toLowerCase().includes(shopKeyword.toLowerCase()))), [enterpriseId, shopKeyword]);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Card><Typography.Title level={3} style={{ margin: 0 }}>新增商户</Typography.Title><Typography.Text type="secondary">先选择企业和商铺，再配置通道与产品费率，保存后进入待审核。</Typography.Text></Card>
      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{['企业新增 / 选择', '商铺新增 / 选择', '结算与银行信息', '通道选择', '产品费率'].map((n) => <Tag key={n} color="default">{n}</Tag>)}</div></div>

      <Form form={form} layout="vertical">
        <Card title="企业新增 / 选择区">
          <Row gutter={16}>
            <Col span={8}><Form.Item name="enterpriseId" label="企业" rules={[{ required: true }]}><Input readOnly placeholder="请使用选择企业弹窗" /></Form.Item></Col>
            <Col span={16}><Space><Button onClick={() => window.open('/enterprises/new', '_blank')}>新增企业</Button><Button onClick={() => setEnterpriseOpen(true)}>选择企业</Button></Space></Col>
          </Row>
        </Card>

        <Card title="商铺新增 / 选择区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="shopId" label="商铺" rules={[{ required: true }]}><Input readOnly placeholder="请使用选择商铺弹窗" /></Form.Item></Col>
            <Col span={16}><Space><Button disabled={!enterpriseId} onClick={() => window.open('/shops/new', '_blank')}>新增商铺</Button><Button disabled={!enterpriseId} onClick={() => setShopOpen(true)}>选择商铺</Button></Space></Col>
          </Row>
        </Card>

        <Card title="结算与银行信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="結算週期" name="settleCycle"><Select options={[{ value: 'D+1' }, { value: 'T+1' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="結算幣種" name="currency"><Select options={[{ value: 'HKD' }, { value: 'USD' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="打款銀行" name="settlementBank"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="FPS賬號" name="fps"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="通道选择区" style={{ marginTop: 16 }}><Form.Item label="通道（可多选）" name="channels" rules={[{ required: true }]}><Select mode="multiple" options={[{ value: 'Adyen_AFP' }, { value: 'Adyen_PAYFAC' }, { value: 'Other' }]} /></Form.Item></Card>
        {channels.length > 0 && <Card title="产品费率区" style={{ marginTop: 16 }}><ProductRateTable editable value={rates} onChange={setRates} /></Card>}
      </Form>

      <div className="sticky-bottom-actions"><Space><Button onClick={() => setDraftOpen(true)}>从草稿复制</Button><Button onClick={() => { const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]'); const values = form.getFieldsValue(); all.unshift({ id: crypto.randomUUID(), owner: OPERATOR, ...values }); localStorage.setItem(DRAFT_KEY, JSON.stringify(all)); message.success('已存成草稿'); }}>存成草稿</Button><Button type="primary" onClick={async () => { await form.validateFields(['enterpriseId', 'shopId', 'channels']); message.success('新增商户已保存，状态为待审核（demo模拟）'); nav('/merchants/m-2'); }}>保存</Button><Button onClick={() => nav(-1)}>取消</Button></Space></div>

      <Modal open={enterpriseOpen} onCancel={() => setEnterpriseOpen(false)} footer={null} title="选择企业" width={940}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Row gutter={12}>
            <Col span={12}><Input placeholder="按编号搜索" value={enterpriseKeyword} onChange={(e) => setEnterpriseKeyword(e.target.value)} /></Col>
            <Col span={12}><Input placeholder="按名称模糊搜索" value={enterpriseKeyword} onChange={(e) => setEnterpriseKeyword(e.target.value)} /></Col>
          </Row>
          <Table rowKey="id" dataSource={filteredEnterprises} pagination={false} columns={[
            { title: '企业编号', dataIndex: 'cid' },
            { title: '企业名称', dataIndex: 'name' },
            {
              title: '操作',
              render: (_, row) => <Button type="link" onClick={() => { form.setFieldsValue({ enterpriseId: row.id, shopId: undefined }); setEnterpriseOpen(false); }}>选择</Button>
            }
          ]} />
        </Space>
      </Modal>

      <Modal open={shopOpen} onCancel={() => setShopOpen(false)} footer={null} title="选择商铺" width={940}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Row gutter={12}>
            <Col span={12}><Input placeholder="按编号搜索" value={shopKeyword} onChange={(e) => setShopKeyword(e.target.value)} /></Col>
            <Col span={12}><Input placeholder="按名称模糊搜索" value={shopKeyword} onChange={(e) => setShopKeyword(e.target.value)} /></Col>
          </Row>
          <Table rowKey="id" dataSource={filteredShops} pagination={false} columns={[
            { title: '商铺编号', dataIndex: 'sid' },
            { title: '商铺名称', dataIndex: 'name' },
            {
              title: '操作',
              render: (_, row) => <Button type="link" onClick={() => { form.setFieldValue('shopId', row.id); setShopOpen(false); }}>选择</Button>
            }
          ]} />
        </Space>
      </Modal>

      <Modal open={draftOpen} onCancel={() => setDraftOpen(false)} footer={null} title="商户草稿箱" width={900}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Row gutter={12}>
            <Col span={12}><Input placeholder="按编号搜索" value={draftKeyword} onChange={(e) => setDraftKeyword(e.target.value)} /></Col>
            <Col span={12}><Input placeholder="按名称模糊搜索" value={draftKeyword} onChange={(e) => setDraftKeyword(e.target.value)} /></Col>
          </Row>
          <Table rowKey="id" dataSource={filteredDrafts} pagination={false} columns={[
            { title: '草稿编号', dataIndex: 'id' },
            { title: '通道', dataIndex: 'channels', render: (v: string[]) => (v || []).join(', ') },
            { title: '银行', dataIndex: 'settlementBank' },
            { title: '操作', render: (_, r: MerchantDraft) => <Space><Button type="link" onClick={() => { form.setFieldsValue(r); setDraftOpen(false); }}>选择</Button><Button type="link" danger onClick={() => { const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: MerchantDraft) => x.id !== r.id); localStorage.setItem(DRAFT_KEY, JSON.stringify(all)); setDraftOpen(false); }}>删除</Button></Space> }
          ]} />
        </Space>
      </Modal>
    </Space>
  );
};
