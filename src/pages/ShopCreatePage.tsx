import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEnterpriseStore } from '../store/enterpriseStore';

interface ShopDraft { id: string; owner: string; name: string; phone: string; email: string; }
const OPERATOR = 'Ops User';
const DRAFT_KEY = 'shop-drafts';

export const ShopCreatePage = () => {
  const [form] = Form.useForm();
  const [search] = useSearchParams();
  const [draftOpen, setDraftOpen] = useState(false);
  const nav = useNavigate();
  const { enterprises } = useEnterpriseStore();
  const lockedEnterpriseId = search.get('enterpriseId') || undefined;

  const drafts = useMemo<ShopDraft[]>(() => JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: ShopDraft) => x.owner === OPERATOR), []);
  const copyFromEnterprise = () => {
    const ent = enterprises.find((e) => e.id === form.getFieldValue('enterpriseId'));
    if (!ent) return;
    form.setFieldsValue({ name: ent.name, phone: ent.phone, email: ent.email, address: ent.sections.address['主要营业地址（原始全文）'] });
    message.success('已从企业复制映射信息');
  };

  const saveDraft = () => {
    const values = form.getFieldsValue();
    const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]');
    const { enterpriseId, ...draftData } = values;
    all.unshift({ id: crypto.randomUUID(), owner: OPERATOR, ...draftData, name: draftData.name || '未命名草稿' });
    localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
    message.success('已存成草稿');
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card><Typography.Title level={3} style={{ margin: 0 }}>新增商铺</Typography.Title><Typography.Text type="secondary">先选择企业，保存后进入待审核状态。</Typography.Text></Card>
      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{['商铺概览', '商铺主键与关联', '商铺名称信息', '商铺主体与经营信息', '商铺基础经营数据', '商铺联系信息', '商铺地址信息', '商铺文件信息', '风控 / 业务信息'].map((n) => <Tag key={n} color="default">{n}</Tag>)}</div></div>

      <Form form={form} layout="vertical" initialValues={{ enterpriseId: lockedEnterpriseId }}>
        <Card title="所属企业选择区" extra={<Space><Button onClick={copyFromEnterprise}>从企业复制信息</Button></Space>}>
          <Row gutter={16}><Col span={12}><Form.Item label="所属企业" name="enterpriseId" rules={[{ required: true }]}><Select disabled={!!lockedEnterpriseId} options={enterprises.map((e) => ({ value: e.id, label: `${e.name} (${e.cid})` }))} /></Form.Item></Col></Row>
        </Card>
        <Card title="商铺资料填写区" style={{ marginTop: 16 }}>
          <Row gutter={16}><Col span={8}><Form.Item label="商铺中文名称" name="name" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={8}><Form.Item label="商铺英文名称" name="nameEn"><Input /></Form.Item></Col><Col span={8}><Form.Item label="商铺类型" name="shopType"><Input /></Form.Item></Col><Col span={8}><Form.Item label="商铺电话" name="phone"><Input /></Form.Item></Col><Col span={8}><Form.Item label="管理员电邮" name="email"><Input /></Form.Item></Col><Col span={8}><Form.Item label="门店地址（原始全文）" name="address"><Input /></Form.Item></Col></Row>
        </Card>
      </Form>

      <div className="sticky-bottom-actions"><Space><Button onClick={() => setDraftOpen(true)}>从草稿复制</Button><Button onClick={saveDraft}>存成草稿</Button><Button type="primary" onClick={async () => { await form.validateFields(['enterpriseId', 'name']); message.success('新增商铺已保存，状态为待审核（demo模拟）'); nav('/shops/shop-1'); }}>保存</Button><Button onClick={() => nav(-1)}>取消</Button></Space></div>

      <Modal open={draftOpen} onCancel={() => setDraftOpen(false)} footer={null} title="商铺草稿箱">
        <Table rowKey="id" dataSource={drafts} pagination={false} columns={[{ title: '名称', dataIndex: 'name' }, { title: '电话', dataIndex: 'phone' }, { title: '邮箱', dataIndex: 'email' }, { title: '操作', render: (_, r: ShopDraft) => <Space><Button type="link" onClick={() => { form.setFieldsValue(r); setDraftOpen(false); }}>选择</Button><Button type="link" danger onClick={() => { const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: ShopDraft) => x.id !== r.id); localStorage.setItem(DRAFT_KEY, JSON.stringify(all)); setDraftOpen(false); }}>删除</Button></Space> }]} />
      </Modal>
    </Space>
  );
};
