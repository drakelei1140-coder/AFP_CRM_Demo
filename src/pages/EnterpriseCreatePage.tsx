import { Button, Card, Col, Form, Input, Modal, Row, Space, Table, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnterpriseStore } from '../store/enterpriseStore';

interface EnterpriseDraft {
  id: string;
  owner: string;
  name: string;
  shortName: string;
  email: string;
  phone: string;
}

const DRAFT_KEY = 'enterprise-drafts';
const OPERATOR = 'Ops User';

const navItems = ['企业概览', '企业主键与关联', '企业名称信息', '企业主体与经营信息', '企业基础经营数据', '企业联系信息', '企业地址信息', '企业文件信息', '风控 / 业务信息'];

export const EnterpriseCreatePage = () => {
  const [form] = Form.useForm();
  const [draftOpen, setDraftOpen] = useState(false);
  const navigate = useNavigate();
  const { enterprises } = useEnterpriseStore();

  const drafts = useMemo<EnterpriseDraft[]>(() => JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: EnterpriseDraft) => x.owner === OPERATOR), []);

  const saveDraft = () => {
    const values = form.getFieldsValue();
    const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]');
    all.unshift({ id: crypto.randomUUID(), owner: OPERATOR, ...values, name: values.name || '未命名草稿' });
    localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
    message.success('已存成草稿');
  };

  const onSave = async () => {
    await form.validateFields(['name', 'shortName']);
    message.success('新增企业已保存，状态为待审核（demo模拟）');
    navigate(`/enterprises/${enterprises[0].id}`);
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Typography.Title level={3} style={{ margin: 0 }}>新增企业</Typography.Title>
        <Typography.Text type="secondary">用于创建新的企业主体资料，保存后进入待审核状态。当前操作人：{OPERATOR}</Typography.Text>
      </Card>

      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{navItems.map((n) => <Tag key={n} color="default">{n}</Tag>)}</div></div>

      <Form form={form} layout="vertical">
        <Card title="企业主键与关联信息区">
          <Row gutter={16}><Col span={8}><Form.Item label="默认主联系人人员ID" name="contactId"><Input /></Form.Item></Col><Col span={8}><Form.Item label="上級公司ID" name="parentId"><Input /></Form.Item></Col></Row>
        </Card>
        <Card title="企业名称信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}><Col span={8}><Form.Item label="商戶中文名稱" name="name" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={8}><Form.Item label="商戶中文簡稱" name="shortName" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={8}><Form.Item label="商戶英文名稱" name="englishName"><Input /></Form.Item></Col></Row>
        </Card>
        <Card title="企业主体与经营信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}><Col span={8}><Form.Item label="公司模式" name="companyMode"><Input /></Form.Item></Col><Col span={8}><Form.Item label="法律地位" name="legalStatus"><Input /></Form.Item></Col><Col span={8}><Form.Item label="MCC Code" name="mcc"><Input /></Form.Item></Col></Row>
        </Card>
        <Card title="企业基础经营数据区" style={{ marginTop: 16 }}>
          <Row gutter={16}><Col span={8}><Form.Item label="進件通道(必須)" name="channel"><Input /></Form.Item></Col><Col span={8}><Form.Item label="每宗交易平均金額" name="avgAmount"><Input /></Form.Item></Col><Col span={8}><Form.Item label="平均每月營業額" name="monthly"><Input /></Form.Item></Col></Row>
        </Card>
        <Card title="企业联系信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}><Col span={8}><Form.Item label="公司電話" name="phone"><Input /></Form.Item></Col><Col span={8}><Form.Item label="管理員電郵" name="email"><Input /></Form.Item></Col><Col span={8}><Form.Item label="微信ID" name="wechat"><Input /></Form.Item></Col></Row>
        </Card>
      </Form>

      <div className="sticky-bottom-actions">
        <Space>
          <Button onClick={() => setDraftOpen(true)}>从草稿复制</Button>
          <Button onClick={saveDraft}>存成草稿</Button>
          <Button type="primary" onClick={onSave}>保存</Button>
          <Button onClick={() => navigate(-1)}>取消</Button>
        </Space>
      </div>

      <Modal open={draftOpen} onCancel={() => setDraftOpen(false)} footer={null} title="企业草稿箱" width={760}>
        <Table rowKey="id" dataSource={drafts} columns={[
          { title: '名称', dataIndex: 'name' },
          { title: '邮箱', dataIndex: 'email' },
          { title: '电话', dataIndex: 'phone' },
          {
            title: '操作',
            render: (_, r: EnterpriseDraft) => <Space><Button type="link" onClick={() => { form.setFieldsValue(r); setDraftOpen(false); }}>选择</Button><Button type="link" danger onClick={() => {
              const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: EnterpriseDraft) => x.id !== r.id);
              localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
              message.success('草稿已删除');
              setDraftOpen(false);
            }}>删除</Button></Space>
          }
        ]} pagination={false} />
      </Modal>
    </Space>
  );
};
