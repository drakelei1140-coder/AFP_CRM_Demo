import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnterpriseStore } from '../store/enterpriseStore';

interface ShopDraft { id: string; owner: string; 商铺名称?: string; 商铺电话?: string; 电邮地址?: string; }
const OPERATOR = 'Ops User';
const DRAFT_KEY = 'shop-drafts';

export const ShopCreatePage = () => {
  const [form] = Form.useForm();
  const [draftOpen, setDraftOpen] = useState(false);
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  const [draftKeyword, setDraftKeyword] = useState('');
  const [enterpriseKeyword, setEnterpriseKeyword] = useState('');
  const nav = useNavigate();
  const { enterprises } = useEnterpriseStore();

  const drafts = useMemo<ShopDraft[]>(() => JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: ShopDraft) => x.owner === OPERATOR), []);
  const filteredDrafts = useMemo(() => drafts.filter((x) => !draftKeyword || x.id.includes(draftKeyword) || (x.商铺名称 || '').toLowerCase().includes(draftKeyword.toLowerCase())), [draftKeyword, drafts]);
  const filteredEnterprises = useMemo(() => enterprises.filter((x) => !enterpriseKeyword || x.cid.includes(enterpriseKeyword) || x.name.toLowerCase().includes(enterpriseKeyword.toLowerCase())), [enterpriseKeyword, enterprises]);

  const copyFromEnterprise = () => {
    const ent = enterprises.find((e) => e.id === form.getFieldValue('enterpriseId'));
    if (!ent) return;
    form.setFieldsValue({ 商铺名称: ent.name, 商铺简称: ent.shortName, 商铺电话: ent.phone, 电邮地址: ent.email, 门店地址: ent.sections.address['主要营业地址（原始全文）'] });
    message.success('已从企业复制映射信息');
  };

  const saveDraft = () => {
    const values = form.getFieldsValue();
    const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]');
    all.unshift({ id: crypto.randomUUID(), owner: OPERATOR, ...values, 商铺名称: values.商铺名称 || '未命名草稿' });
    localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
    message.success('已存成草稿');
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card><Typography.Title level={3} style={{ margin: 0 }}>新增商铺</Typography.Title><Typography.Text type="secondary">先选择企业，保存后进入待审核状态。</Typography.Text></Card>
      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{['商铺主键与关联', '商铺资料编辑', '关联企业信息展示', '关联 MID 信息展示'].map((n) => <Tag key={n} color="default">{n}</Tag>)}</div></div>

      <Form form={form} layout="vertical">
        <Card title="所属企业选择区" extra={<Space><Button onClick={copyFromEnterprise}>从企业复制信息</Button><Button onClick={() => setEnterpriseOpen(true)}>选择企业</Button></Space>}>
          <Row gutter={16}><Col span={12}><Form.Item label="所属企业" name="enterpriseId" rules={[{ required: true }]}><Input readOnly placeholder="请使用选择企业弹窗" /></Form.Item></Col><Col span={12}><Form.Item label="所属企业名称"><Input value={enterprises.find((x) => x.id === form.getFieldValue('enterpriseId'))?.name} readOnly /></Form.Item></Col></Row>
        </Card>

        <Card title="商铺资料编辑区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="商铺名称" label="商铺名称" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="商铺简称" label="商铺简称" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="英文名" label="英文名"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="门头名称" label="门头名称" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="收据显示名称" label="收据显示名称" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="商铺类型" label="商铺类型" rules={[{ required: true }]}><Select options={[{ value: '线下门店' }, { value: '网店' }, { value: '活动店' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="经营模式" label="经营模式" rules={[{ required: true }]}><Select options={[{ value: '直营' }, { value: '加盟' }, { value: '连锁' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="开店日期" label="开店日期" rules={[{ required: true }]}><Input placeholder="YYYY-MM-DD" /></Form.Item></Col>
            <Col span={8}><Form.Item name="商铺电话" label="商铺电话" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="电邮地址" label="电邮地址" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="商铺网站" label="商铺网站"><Input /></Form.Item></Col>
            <Col span={24}><Form.Item name="门店地址" label="门店地址"><Input /></Form.Item></Col>
            <Col span={24}><Form.Item name="营业地址" label="营业地址"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="收机地址" label="收机地址"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="邮寄地址" label="邮寄地址"><Input /></Form.Item></Col>
            <Col span={24}><Form.Item name="商铺说明" label="商铺说明"><Input.TextArea rows={3} maxLength={500} /></Form.Item></Col>
            <Col span={24}><Form.Item name="商铺对外展示说明" label="商铺对外展示说明"><Input.TextArea rows={3} maxLength={500} /></Form.Item></Col>
            <Col span={24}><Form.Item name="本平台补充备注" label="本平台补充备注"><Input.TextArea rows={4} maxLength={800} /></Form.Item></Col>
          </Row>
        </Card>
      </Form>

      <div className="sticky-bottom-actions"><Space><Button onClick={() => setDraftOpen(true)}>从草稿复制</Button><Button onClick={saveDraft}>存成草稿</Button><Button type="primary" onClick={async () => { await form.validateFields(['enterpriseId', '商铺名称', '商铺简称', '门头名称', '收据显示名称']); message.success('新增商铺已保存，状态为待审核（demo模拟）'); nav('/shops/shop-1'); }}>保存</Button><Button onClick={() => nav(-1)}>取消</Button></Space></div>

      <Modal open={enterpriseOpen} onCancel={() => setEnterpriseOpen(false)} footer={null} title="选择企业" width={960}>
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <Row gutter={12}>
            <Col span={12}><Input placeholder="按编号搜索" value={enterpriseKeyword} onChange={(e) => setEnterpriseKeyword(e.target.value)} /></Col>
            <Col span={12}><Input placeholder="按名称模糊搜索" value={enterpriseKeyword} onChange={(e) => setEnterpriseKeyword(e.target.value)} /></Col>
          </Row>
          <Table rowKey="id" dataSource={filteredEnterprises} pagination={false} columns={[
            { title: '企业编号', dataIndex: 'cid' },
            { title: '企业名称', dataIndex: 'name' },
            { title: '地区', dataIndex: 'region' },
            {
              title: '操作',
              render: (_, r) => <Button type="link" onClick={() => { form.setFieldValue('enterpriseId', r.id); setEnterpriseOpen(false); }}>选择</Button>
            }
          ]} />
        </Space>
      </Modal>

      <Modal open={draftOpen} onCancel={() => setDraftOpen(false)} footer={null} title="商铺草稿箱" width={900}>
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <Row gutter={12}>
            <Col span={12}><Input placeholder="按编号搜索" value={draftKeyword} onChange={(e) => setDraftKeyword(e.target.value)} /></Col>
            <Col span={12}><Input placeholder="按名称模糊搜索" value={draftKeyword} onChange={(e) => setDraftKeyword(e.target.value)} /></Col>
          </Row>
          <Table rowKey="id" dataSource={filteredDrafts} pagination={false} columns={[{ title: '草稿编号', dataIndex: 'id' }, { title: '商铺名称', dataIndex: '商铺名称' }, { title: '电话', dataIndex: '商铺电话' }, { title: '邮箱', dataIndex: '电邮地址' }, { title: '操作', render: (_, r: ShopDraft) => <Space><Button type="link" onClick={() => { form.setFieldsValue(r); setDraftOpen(false); }}>选择</Button><Button type="link" danger onClick={() => { const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: ShopDraft) => x.id !== r.id); localStorage.setItem(DRAFT_KEY, JSON.stringify(all)); setDraftOpen(false); }}>删除</Button></Space> }]} />
        </Space>
      </Modal>
    </Space>
  );
};
