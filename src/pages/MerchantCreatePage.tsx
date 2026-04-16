import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductRateTable, buildRateRows, type ProductRateRow } from '../components/ProductRateTable';

interface MerchantDraft { id: string; owner: string; channelCodes: string[]; settlementBank: string; }
const OPERATOR = 'Ops User';
const DRAFT_KEY = 'merchant-drafts';

export const MerchantCreatePage = () => {
  const [form] = Form.useForm();
  const [rates, setRates] = useState<ProductRateRow[]>(buildRateRows());
  const [draftOpen, setDraftOpen] = useState(false);
  const nav = useNavigate();
  const channels: string[] = Form.useWatch('channels', form) || [];
  const enterpriseId = Form.useWatch('enterpriseId', form);

  const drafts = useMemo<MerchantDraft[]>(() => JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: MerchantDraft) => x.owner === OPERATOR), []);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Card><Typography.Title level={3} style={{ margin: 0 }}>新增商户</Typography.Title><Typography.Text type="secondary">先选择企业和商铺，再配置通道与产品费率，保存后进入待审核。</Typography.Text></Card>
      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{['商户概览', '主键与关联', '企业选择信息', '商铺选择信息', '商户资料', '结算与银行信息', '通道选择', '产品费率', '特殊费率申请信息'].map((n) => <Tag key={n} color="default">{n}</Tag>)}</div></div>

      <Form form={form} layout="vertical">
        <Card title="企业新增 / 选择区"><Row gutter={16}><Col span={8}><Form.Item name="enterpriseId" label="企业" rules={[{ required: true }]}><Select options={[{ value: 'CID-101', label: 'HK Food Group (CID-101)' }]} /></Form.Item></Col><Col span={16}><Space><Button onClick={() => window.open('/enterprises/new', '_blank')}>新增企业</Button><Button>选择企业</Button></Space></Col></Row></Card>
        <Card title="商铺新增 / 选择区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={8}><Form.Item name="shopId" label="商铺" rules={[{ required: true }]}><Select disabled={!enterpriseId} options={[{ value: 'SID-10001', label: '尖沙咀旗舰店 (SID-10001)' }]} /></Form.Item></Col><Col span={16}><Space><Button disabled={!enterpriseId} onClick={() => window.open('/shops/new', '_blank')}>新增商铺</Button><Button disabled={!enterpriseId}>选择商铺</Button></Space></Col></Row></Card>
        <Card title="结算与银行信息区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={8}><Form.Item label="打款銀行" name="settlementBank"><Input /></Form.Item></Col><Col span={8}><Form.Item label="FPS賬號" name="fps"><Input /></Form.Item></Col><Col span={8}><Form.Item label="收款銀行賬戶名稱" name="bankAccountName"><Input /></Form.Item></Col></Row></Card>
        <Card title="通道选择区" style={{ marginTop: 16 }}><Form.Item label="通道（可多选）" name="channels" rules={[{ required: true }]}><Select mode="multiple" options={[{ value: 'Adyen_AFP' }]} /></Form.Item></Card>
        {channels.length > 0 && <Card title="产品费率区" style={{ marginTop: 16 }}><ProductRateTable editable value={rates} onChange={setRates} /></Card>}
      </Form>

      <div className="sticky-bottom-actions"><Space><Button onClick={() => setDraftOpen(true)}>从草稿复制</Button><Button onClick={() => { const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]'); const { enterpriseId: _, shopId: __, ...values } = form.getFieldsValue(); all.unshift({ id: crypto.randomUUID(), owner: OPERATOR, ...values }); localStorage.setItem(DRAFT_KEY, JSON.stringify(all)); message.success('已存成草稿'); }}>存成草稿</Button><Button type="primary" onClick={async () => { await form.validateFields(['enterpriseId', 'shopId', 'channels']); message.success('新增商户已保存，状态为待审核（demo模拟）'); nav('/merchants/m-2'); }}>保存</Button><Button onClick={() => nav(-1)}>取消</Button></Space></div>

      <Modal open={draftOpen} onCancel={() => setDraftOpen(false)} footer={null} title="商户草稿箱">
        <Table rowKey="id" dataSource={drafts} pagination={false} columns={[{ title: '通道', dataIndex: 'channelCodes', render: (v: string[]) => (v || []).join(', ') }, { title: '银行', dataIndex: 'settlementBank' }, { title: '操作', render: (_, r: MerchantDraft) => <Space><Button type="link" onClick={() => { form.setFieldsValue(r); setDraftOpen(false); }}>选择</Button><Button type="link" danger onClick={() => { const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: MerchantDraft) => x.id !== r.id); localStorage.setItem(DRAFT_KEY, JSON.stringify(all)); setDraftOpen(false); }}>删除</Button></Space> }]} />
      </Modal>
    </Space>
  );
};
