import { Button, Card, Col, Form, Input, Row, Space, Typography, message } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductRateTable, buildRateRows, type ProductRateRow } from '../components/ProductRateTable';
import { merchantFieldGroups } from '../config/fieldSchemas';

const valueMap: Record<string, string> = {
  MID: 'MID-002', CID: 'CID-101', SID: 'SID-10002', 渠道编码: 'ADY_AFP', 服务编码: 'POS_CORE', 进件通道: 'Adyen_AFP',
  清算模式: 'T+1', 'Store参考号 / 门店编码': 'ST_REF_90002', H5支付域名: 'https://pay.shop.demo', 結算摘要前綴: 'KPAY', 卡類型: 'VISA/MC', 結算身份證號: 'A123456(7)',
  結算週期: 'D+1', 結算幣種: 'HKD', 打款銀行: 'DBS', FPS賬號: 'FPS-9002', 收款銀行賬戶名稱: 'HK Food Group Ltd', 通道列表: 'Adyen_AFP'
};

export const MerchantReviewEditPage = () => {
  const { id = 'm-2' } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [rates, setRates] = useState<ProductRateRow[]>(buildRateRows());

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>商户审核编辑</Typography.Title>
      <Form form={form} layout="vertical" initialValues={valueMap}>
        {merchantFieldGroups.map((group) => (
          <Card key={group.key} title={group.title}><Row gutter={16}>{group.fields.map((field) => <Col span={8} key={field}><Form.Item label={field} name={field}><Input disabled={['MID', 'CID', 'SID'].includes(field)} /></Form.Item></Col>)}</Row></Card>
        ))}
        <Card title="企业信息展示区"><div>企业：HK Food Group（只读）</div></Card>
        <Card title="商铺信息展示区"><div>商铺：旺角站前店（只读）</div></Card>
        <Card title="产品费率区"><ProductRateTable editable value={rates} onChange={setRates} /></Card>
        <Card><Space><Button type="primary" onClick={async () => { await form.validateFields(); message.success('已生成商户资料修改待审核记录（demo模拟）'); navigate(`/merchants/${id}`); }}>保存并提交审核</Button><Button onClick={() => navigate(`/merchants/${id}`)}>取消</Button></Space></Card>
      </Form>
    </Space>
  );
};
