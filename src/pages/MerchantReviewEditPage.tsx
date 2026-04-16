import { Button, Card, Col, Descriptions, Form, Input, Row, Select, Space, Typography, message } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductRateTable, buildRateRows, type ProductRateRow } from '../components/ProductRateTable';

export const MerchantReviewEditPage = () => {
  const { id = 'm-2' } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [rates, setRates] = useState<ProductRateRow[]>(buildRateRows());

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>商户审核编辑</Typography.Title>
        <Typography.Text type="secondary">企业和商铺信息只读展示，本页仅提交商户资料修改待审核记录。</Typography.Text>
      </div>

      <Card title="基础信息区">
        <Descriptions bordered size="small" column={3} items={[
          { key: 'mid', label: 'MID', children: 'MID-002' },
          { key: 'cid', label: 'CID', children: 'CID-101' },
          { key: 'sid', label: 'SID', children: 'SID-10002' },
          { key: 'status', label: '商户审核状态', children: '基础资料审核' }
        ]} />
      </Card>

      <Form form={form} layout="vertical" initialValues={{ channels: ['Adyen_AFP'] }}>
        <Card title="企业信息展示区">
          <Descriptions bordered size="small" column={3} items={[{ key: 'enterprise', label: '企业', children: 'HK Food Group' }, { key: 'cid2', label: 'CID', children: 'CID-101' }, { key: 'estatus', label: '企业审核状态', children: '待风控审核' }]} />
        </Card>
        <Card title="商铺信息展示区" style={{ marginTop: 16 }}>
          <Descriptions bordered size="small" column={3} items={[{ key: 'shop', label: '商铺', children: '旺角站前店' }, { key: 'sid2', label: 'SID', children: 'SID-10002' }, { key: 'sstatus', label: '商铺审核状态', children: '待风控审核' }]} />
        </Card>
        <Card title="结算与银行信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}><Col span={8}><Form.Item label="結算週期" name="settleCycle"><Select options={[{ value: 'D+1' }, { value: 'T+1' }]} /></Form.Item></Col><Col span={8}><Form.Item label="結算幣種" name="currency"><Select options={[{ value: 'HKD' }, { value: 'USD' }]} /></Form.Item></Col><Col span={8}><Form.Item label="打款銀行" name="bank"><Input /></Form.Item></Col><Col span={8}><Form.Item label="FPS賬號" name="fps"><Input /></Form.Item></Col></Row>
        </Card>
        <Card title="通道选择区" style={{ marginTop: 16 }}><Form.Item label="通道（可多选）" name="channels"><Select mode="multiple" options={[{ value: 'Adyen_AFP' }]} /></Form.Item></Card>
        <Card title="产品费率区" style={{ marginTop: 16 }}><ProductRateTable editable value={rates} onChange={setRates} /></Card>

        <Card style={{ marginTop: 16 }}>
          <Space><Button type="primary" onClick={async () => { await form.validateFields(); message.success('已生成商户资料修改待审核记录（demo 模拟）'); navigate(`/merchants/${id}`); }}>保存并提交审核</Button><Button onClick={() => navigate(`/merchants/${id}`)}>取消</Button></Space>
        </Card>
      </Form>
    </Space>
  );
};
