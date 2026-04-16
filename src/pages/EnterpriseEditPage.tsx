import { Button, Card, Col, Descriptions, Form, Input, Row, Space, Table, Typography, message } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enterpriseFieldGroups } from '../config/fieldSchemas';
import { useEnterpriseStore } from '../store/enterpriseStore';

export const EnterpriseEditPage = () => {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const store = useEnterpriseStore();
  const ent = store.getEnterprise(id);
  const [form] = Form.useForm();

  const initialValues = useMemo(() => {
    if (!ent) return {};
    return {
      CID: ent.cid,
      ...ent.sections.keys,
      ...ent.sections.names,
      ...ent.sections.operation,
      ...ent.sections.basic,
      ...ent.sections.contact,
      ...ent.sections.address,
      ...ent.sections.file,
      ...ent.sections.risk
    };
  }, [ent]);

  if (!ent) return <Card>未找到企业</Card>;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Typography.Title level={3} style={{ margin: 0 }}>企业编辑</Typography.Title>
      <Card title="基础信息区（系统识别字段，只读）"><Descriptions column={3} bordered items={[{ key: 'name', label: '企业名称', children: ent.name }, { key: 'cid', label: '企业编号', children: ent.cid }, { key: 'review', label: '企业审核状态', children: ent.reviewStatus }]} /></Card>

      <Form layout="vertical" form={form} initialValues={initialValues} onFinish={(values) => { store.submitEditDraft(ent.id, values); message.success('已提交企业资料修改待审核记录（demo模拟）'); nav(`/enterprises/${ent.id}`); }}>
        {enterpriseFieldGroups.map((group) => (
          <Card key={group.key} title={group.title} style={{ marginTop: 16 }}>
            <Row gutter={16}>{group.fields.map((field) => <Col span={8} key={field}><Form.Item name={field} label={field}><Input disabled={field === 'CID'} /></Form.Item></Col>)}</Row>
          </Card>
        ))}
        <Card style={{ marginTop: 16 }}><Space><Button htmlType="submit" type="primary">保存并提交审核</Button><Button onClick={() => nav(-1)}>取消</Button></Space></Card>
      </Form>

      <Card title="关联商铺信息展示区"><Table rowKey="id" pagination={false} dataSource={ent.shops} columns={[{ title: '商铺名称', dataIndex: 'name' }, { title: '商铺编号', dataIndex: 'id' }, { title: '地区', dataIndex: 'region' }]} /></Card>
      <Card title="关联 MID 信息展示区"><Table rowKey="id" pagination={false} dataSource={ent.mids} columns={[{ title: 'MID 编号', dataIndex: 'id' }, { title: '所属商铺', dataIndex: 'shopName' }, { title: '服务通道', dataIndex: 'channel' }]} /></Card>
    </Space>
  );
};
