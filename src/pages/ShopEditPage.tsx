import { Button, Card, Col, Form, Input, Row, Space, Table, Typography, message } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { shopFieldGroups } from '../config/fieldSchemas';

const mock = {
  id: 'shop-1',
  valueMap: {
    SID: 'SID-10001',
    '所属企业编号（CID）': 'CID-101',
    '默认主联系人人员ID': 'P-1001',
    商铺中文名称: '尖沙咀旗舰店',
    商铺英文名称: 'TST Flagship Store',
    门头名称: 'KPay TST',
    商铺类型: '线下门店',
    经营模式: '直营',
    'MCC Code': '5812',
    '進件通道(必須)': 'Adyen-AFP',
    每宗交易平均金額: '300',
    平均每月營業額: 'HKD 2,300,000',
    商铺电话: '+852 2123 8888',
    管理员电邮: 'admin@shop.demo',
    运营电邮: 'ops@shop.demo',
    '门店地址（原始全文）': '香港尖沙咀海港城 3F 301',
    '门店地址-城市': 'Hong Kong',
    '门店地址-国家': 'HK',
    门头照片: 'head_sign.jpg',
    营业场所证明: 'business_proof.pdf',
    '租赁合同 / 场地证明': 'lease_contract.pdf',
    風控類型: '标准',
    風險等級: '低',
    上單來源: 'CRM'
  },
  relatedEnterprise: [{ name: 'HK Food Group', cid: 'CID-101' }],
  relatedMid: [{ mid: 'MID-7701', channel: 'Adyen-AFP' }],
  relatedDevices: [{ model: 'V400m', quantity: 4 }]
};

export const ShopEditPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const initialValues = useMemo(() => mock.valueMap, []);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Typography.Title level={3} style={{ margin: 0 }}>商铺编辑</Typography.Title>
      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={() => { message.success('已生成商铺资料修改待审核记录（demo模拟）'); navigate(`/shops/${id || mock.id}`); }}>
        {shopFieldGroups.map((group) => (
          <Card key={group.key} title={group.title}>
            <Row gutter={16}>{group.fields.map((field) => <Col span={8} key={field}><Form.Item label={field} name={field}><Input disabled={['SID', '所属企业编号（CID）'].includes(field)} /></Form.Item></Col>)}</Row>
          </Card>
        ))}
        <Card><Space><Button type="primary" htmlType="submit">保存并提交审核</Button><Button onClick={() => navigate(-1)}>取消</Button></Space></Card>
      </Form>
      <Card title="关联企业信息展示区"><Table rowKey="cid" pagination={false} dataSource={mock.relatedEnterprise} columns={[{ title: '企业名称', dataIndex: 'name' }, { title: '企业编号', dataIndex: 'cid' }]} /></Card>
      <Card title="关联 MID 信息展示区"><Table rowKey="mid" pagination={false} dataSource={mock.relatedMid} columns={[{ title: 'MID 编号', dataIndex: 'mid' }, { title: '服务通道', dataIndex: 'channel' }]} /></Card>
      <Card title="关联终端设备信息展示区"><Table rowKey="model" pagination={false} dataSource={mock.relatedDevices} columns={[{ title: '设备型号', dataIndex: 'model' }, { title: '数量', dataIndex: 'quantity' }]} /></Card>
    </Space>
  );
};
