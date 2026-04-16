import { Button, Card, Col, Descriptions, Form, Input, Row, Select, Space, Table, Typography, message } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const shopEditMock = {
  id: 'shop-1',
  name: '尖沙咀旗舰店',
  sid: 'SID-10001',
  enterpriseName: 'HK Food Group',
  cid: 'CID-101',
  region: 'HK',
  enableStatus: null,
  reviewStatus: '待审核',
  channels: ['Adyen-AFP'],
  source: ['CRM'],
  creator: 'OPS-Lily',
  createdAt: '2026-04-01 10:00:00',
  updatedAt: '2026-04-10 11:30:00',
  fields: {
    商铺名称: '尖沙咀旗舰店',
    商铺简称: '尖沙咀店',
    英文名: 'TST Flagship Store',
    门头名称: 'KPay TST',
    收据显示名称: 'KPay-TST',
    商铺类型: '线下门店',
    经营模式: '直营',
    开店日期: '2020-08-01',
    商铺电话: '+852 2123 8888',
    电邮地址: 'admin@shop.demo',
    门店地址: '香港尖沙咀海港城 3F 301',
    营业地址: '同门店地址',
    收机地址: '同门店地址',
    邮寄地址: '香港尖沙咀邮政信箱 1001',
    商铺网站: 'https://shop.demo',
    商铺说明: '旗舰门店',
    商铺对外展示说明: '旅游商圈门店',
    本平台补充备注: '本次修改仅走资料修改待审核'
  },
  afp: {
    storeId: 'ST_AFP_90001',
    reference: 'ST_REF_90001',
    status: 'active'
  },
  relatedEnterprise: [
    { name: 'HK Food Group', cid: 'CID-101', region: 'HK', enableStatus: '启用', reviewStatus: '审核通过' }
  ],
  relatedMid: [
    { mid: 'MID-7701', thirdMid: 'ADY-99311', channel: 'Adyen-AFP', status: 'Active', updatedAt: '2026-04-10 10:00:00' }
  ],
  relatedDevices: [
    { model: 'V400m', category: 'POS', quantity: 4, bindStatus: '已绑定', updatedAt: '2026-04-10 11:30:00' },
    { model: 'A920', category: 'SmartPOS', quantity: 2, bindStatus: '部分绑定', updatedAt: '2026-04-10 11:30:00' }
  ]
};

export const ShopEditPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const initialValues = useMemo(() => ({ ...shopEditMock.fields }), []);

  const onSubmit = (values: Record<string, string>) => {
    message.success('已生成商铺资料修改待审核记录（demo模拟），正式数据未直接覆盖。');
    console.log('shop-edit-draft', { id: id || shopEditMock.id, values, flow: '商铺资料修改待审核流程' });
    navigate(`/shops/${id || shopEditMock.id}`);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Typography.Title level={3} style={{ margin: 0 }}>商铺编辑</Typography.Title>

      <Card title="基础信息区（系统字段只读）">
        <Descriptions bordered column={3} items={[
          { key: 'name', label: '商铺名称', children: shopEditMock.name },
          { key: 'sid', label: '商铺编号（SID）', children: shopEditMock.sid },
          { key: 'enterpriseName', label: '所属企业名称', children: shopEditMock.enterpriseName },
          { key: 'cid', label: '所属企业编号（CID）', children: shopEditMock.cid },
          { key: 'region', label: '地区', children: shopEditMock.region },
          { key: 'enable', label: '商铺启用状态', children: shopEditMock.enableStatus || '-' },
          { key: 'review', label: '商铺审核状态', children: shopEditMock.reviewStatus },
          { key: 'channel', label: '服务通道', children: shopEditMock.channels.join(', ') },
          { key: 'source', label: '上單來源', children: shopEditMock.source.join(', ') },
          { key: 'creator', label: '创建人', children: shopEditMock.creator },
          { key: 'createdAt', label: '创建时间', children: shopEditMock.createdAt },
          { key: 'updatedAt', label: '更新时间', children: shopEditMock.updatedAt }
        ]} />
      </Card>

      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={onSubmit}>
        <Card title="商铺资料编辑区">
          <Row gutter={16}>
            <Col span={8}><Form.Item name="商铺名称" label="商铺名称" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="商铺简称" label="商铺简称" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="英文名" label="英文名"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="门头名称" label="门头名称" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="收据显示名称" label="收据显示名称" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="商铺类型" label="商铺类型" rules={[{ required: true }]}><Select options={[{ value: '线下门店' }, { value: '网店' }, { value: '活动店' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="经营模式" label="经营模式" rules={[{ required: true }]}><Select options={[{ value: '直营' }, { value: '加盟' }, { value: '连锁' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="开店日期" label="开店日期" rules={[{ required: true }]}><Input placeholder="YYYY-MM-DD" /></Form.Item></Col>
            <Col span={8}><Form.Item name="商铺电话" label="商铺电话" rules={[{ required: true }, { pattern: /^[+\d\s-]{6,30}$/ }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="电邮地址" label="电邮地址" rules={[{ required: true }, { type: 'email' }]}><Input /></Form.Item></Col>
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


        <Card title="关联企业信息展示区" style={{ marginTop: 16 }}>
          <Table rowKey="cid" pagination={false} dataSource={shopEditMock.relatedEnterprise} columns={[
            { title: '企业名称', dataIndex: 'name' },
            { title: '企业编号', dataIndex: 'cid' },
            { title: '地区', dataIndex: 'region' },
            { title: '启用状态', dataIndex: 'enableStatus' },
            { title: '审核状态', dataIndex: 'reviewStatus' },
            { title: '操作', render: () => <Button type="link">查看详情</Button> }
          ]} />
        </Card>

        <Card title="关联 MID 信息展示区" style={{ marginTop: 16 }}>
          <Table rowKey="mid" pagination={false} dataSource={shopEditMock.relatedMid} columns={[
            { title: 'MID 编号', dataIndex: 'mid' },
            { title: '第三方渠道 MID', dataIndex: 'thirdMid' },
            { title: '服务通道', dataIndex: 'channel' },
            { title: '当前状态', dataIndex: 'status' },
            { title: '更新时间', dataIndex: 'updatedAt' },
            { title: '操作', render: () => <Button type="link">查看详情</Button> }
          ]} />
        </Card>

        <Card title="关联终端设备信息展示区" style={{ marginTop: 16 }}>
          <Table rowKey="model" pagination={false} dataSource={shopEditMock.relatedDevices} columns={[
            { title: '设备型号', dataIndex: 'model' },
            { title: '设备分类', dataIndex: 'category' },
            { title: '数量', dataIndex: 'quantity' },
            { title: '绑定状态', dataIndex: 'bindStatus' },
            { title: '更新时间', dataIndex: 'updatedAt' }
          ]} />
        </Card>

        <Card style={{ marginTop: 16 }}>
          <Space>
            <Button type="primary" htmlType="submit">保存并提交审核</Button>
            <Button onClick={() => navigate(-1)}>取消</Button>
          </Space>
        </Card>
      </Form>
    </Space>
  );
};
