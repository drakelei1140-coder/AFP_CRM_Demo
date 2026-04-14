import { Alert, Button, Card, Col, Descriptions, Form, Input, Row, Select, Space, Table, Typography, message } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEnterpriseStore } from '../store/enterpriseStore';

export const EnterpriseEditPage = () => {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const store = useEnterpriseStore();
  const ent = store.getEnterprise(id);
  const [form] = Form.useForm();

  const initial = useMemo(() => ({
    name: ent?.name,
    shortName: ent?.shortName,
    englishName: ent?.englishName,
    companyMode: ent?.companyMode,
    legalStatus: ent?.legalStatus,
    foundedAt: ent?.foundedAt,
    phone: ent?.phone,
    email: ent?.email,
    region: ent?.region,
    website: 'https://demo.kpay.com',
    note: '本平台补充备注'
  }), [ent]);

  if (!ent) return <Card>未找到企业</Card>;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Typography.Title level={3} style={{ margin: 0 }}>企业编辑</Typography.Title>
      <Card title="基础信息区">
        <Descriptions column={3} bordered items={[
          { key: 'name', label: '企业名称', children: ent.name },
          { key: 'cid', label: '企业编号', children: ent.cid },
          { key: 'region', label: '地区', children: ent.region },
          { key: 'enable', label: '企业启用状态', children: ent.enableStatus || '-' },
          { key: 'review', label: '企业审核状态', children: ent.reviewStatus },
          { key: 'channel', label: '服务通道', children: ent.channels.join(', ') },
          { key: 'source', label: '上單來源', children: ent.source.join(', ') },
          { key: 'creator', label: '创建人', children: ent.creator },
          { key: 'updatedAt', label: '更新时间', children: ent.updatedAt }
        ]} />
      </Card>

      <Card title="企业资料编辑区">
        <Form layout="vertical" form={form} initialValues={initial} onFinish={(values) => { store.submitEditDraft(ent.id, values); message.success('已提交企业资料修改待审核记录（demo模拟）'); nav(`/enterprises/${ent.id}`); }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="name" label="企业名称" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="shortName" label="企业简称" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="englishName" label="英文名"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="companyMode" label="公司模式" rules={[{ required: true }]}><Select options={[{ value: '直营' }, { value: '加盟' }, { value: '连锁' }, { value: '其他' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="legalStatus" label="法律地位" rules={[{ required: true }]}><Select options={[{ value: '个人' }, { value: '个体工商户' }, { value: '有限公司' }, { value: '股份有限公司' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="foundedAt" label="成立时间" rules={[{ required: true }]}><Input placeholder="YYYY-MM-DD" /></Form.Item></Col>
            <Col span={8}><Form.Item name="phone" label="公司电话" rules={[{ required: true }, { pattern: /^[+\d\s-]{6,20}$/ }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="email" label="电邮地址" rules={[{ required: true }, { type: 'email' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="website" label="企业网站"><Input /></Form.Item></Col>
            <Col span={24}><Form.Item name="note" label="本平台补充备注"><Input.TextArea rows={4} maxLength={300} /></Form.Item></Col>
          </Row>
          <Space><Button htmlType="submit" type="primary">保存并提交审核</Button><Button onClick={() => nav(-1)}>取消</Button></Space>
        </Form>
      </Card>

      <Card title="AFP 相关信息展示区">
        <Alert showIcon type="info" message="AFP 相关信息由通道返回或同步，本页仅展示，不支持编辑。" style={{ marginBottom: 12 }} />
        <Descriptions bordered items={ent.afpSummary.map((i) => ({ key: i.key, label: i.key, children: i.value }))} />
      </Card>

      <Card title="关联商铺信息展示区">
        <Table rowKey="id" pagination={false} dataSource={ent.shops} columns={[{ title: '商铺名称', dataIndex: 'name' }, { title: '商铺编号', dataIndex: 'id' }, { title: '地区', dataIndex: 'region' }, { title: '启用状态', dataIndex: 'enableStatus' }, { title: '审核状态', dataIndex: 'reviewStatus' }, { title: '操作', render: () => <Button type="link">查看详情</Button> }]} />
      </Card>

      <Card title="关联 MID 信息展示区">
        <Table rowKey="id" pagination={false} dataSource={ent.mids} columns={[{ title: 'MID 编号', dataIndex: 'id' }, { title: '所属商铺', dataIndex: 'shopName' }, { title: '服务通道', dataIndex: 'channel' }, { title: '当前状态', dataIndex: 'status' }, { title: '更新时间', dataIndex: 'updatedAt' }, { title: '操作', render: () => <Button type="link">查看详情</Button> }]} />
      </Card>
    </Space>
  );
};
