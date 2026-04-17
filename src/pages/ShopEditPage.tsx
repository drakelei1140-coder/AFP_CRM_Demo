import { Button, Card, Col, Descriptions, Form, Input, Row, Select, Space, Table, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const shopEditMock = {
  id: 'shop-1',
  overview: {
    商铺名称: '尖沙咀旗舰店',
    '商铺编号（SID）': 'SID-10001',
    '所属企业名称': 'HK Food Group',
    '所属企业编号（CID）': 'CID-101',
    地区: 'HK',
    商铺启用状态: '-',
    商铺审核状态: '待审核',
    服务通道: 'Adyen-AFP',
    上單來源: 'CRM',
    创建人: 'OPS-Lily',
    创建时间: '2026-04-01 10:00:00',
    更新时间: '2026-04-10 11:30:00'
  },
  sections: {
    keys: {
      SID: 'SID-10001',
      '所属企业编号（CID）': 'CID-101',
      '所属企业名称': 'HK Food Group',
      默认主联系人人员ID: 'P-1001',
      上级商铺ID: '-',
      所属地区: 'HK',
      服务通道: 'Adyen-AFP'
    },
    names: {
      商铺中文名称: '尖沙咀旗舰店',
      商铺英文名称: 'TST Flagship Store',
      门头名称: 'KPay TST',
      收据显示名称: 'KPay-TST'
    },
    operation: {
      商铺类型: '线下门店',
      经营模式: '直营',
      '行业分类 / 业务性质 / 产品服务': '餐饮, 咖啡',
      'MCC Code': '5812'
    },
    basic: {
      '進件通道(必須)': 'Adyen-AFP',
      每宗交易平均金額: '300',
      每宗交易最大交易額: '2800',
      預計每年交易宗數: '220000'
    },
    contact: { 商铺电话: '+852 2123 8888', 管理员电邮: 'admin@shop.demo', 运营电邮: 'ops@shop.demo' },
    address: { '门店地址（原始全文）': '香港尖沙咀海港城 3F 301', '门店地址-城市': 'Hong Kong', '门店地址-国家': 'HK' },
    files: { 门头照片: 'head_sign.jpg', 营业场所证明: 'business_proof.pdf' },
    risk: { 風控類型: '标准', 風險等級: '低', 審核類型: '新建审核', 上單來源: 'CRM' }
  },
  relatedEnterprise: [{ name: 'HK Food Group', cid: 'CID-101', region: 'HK', enableStatus: '启用', reviewStatus: '审核通过' }],
  relatedMid: [{ mid: 'MID-7701', thirdMid: 'ADY-99311', channel: 'Adyen-AFP', status: 'Active', updatedAt: '2026-04-10 10:00:00' }],
  relatedDevices: [{ model: 'V400m', category: 'POS', quantity: 4, bindStatus: '已绑定', updatedAt: '2026-04-10 11:30:00' }]
};

const navItems = [
  ['keys', '商铺主键与关联'],
  ['names', '商铺名称信息'],
  ['operation', '商铺主体与经营信息'],
  ['basic', '商铺基础经营数据'],
  ['contact', '商铺联系信息'],
  ['address', '商铺地址信息'],
  ['files', '商铺文件信息'],
  ['risk', '风控 / 业务信息']
] as const;

export const ShopEditPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [activeSection, setActiveSection] = useState('keys');

  const initialValues = useMemo(() => ({ ...shopEditMock.sections.keys, ...shopEditMock.sections.names, ...shopEditMock.sections.operation, ...shopEditMock.sections.basic, ...shopEditMock.sections.contact, ...shopEditMock.sections.address, ...shopEditMock.sections.files, ...shopEditMock.sections.risk }), []);

  useEffect(() => {
    const nodes = navItems.map(([k]) => document.getElementById(k)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current?.target?.id) setActiveSection(current.target.id);
    }, { rootMargin: '-180px 0px -65% 0px', threshold: [0.1, 0.3, 0.6] });
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const onSubmit = (values: Record<string, string>) => {
    message.success('已生成商铺资料修改待审核记录（demo模拟），正式数据未直接覆盖。');
    console.log('shop-edit-draft', { id: id || shopEditMock.id, values, flow: '商铺资料修改待审核流程' });
    navigate(`/shops/${id || shopEditMock.id}`);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Typography.Title level={3} style={{ margin: 0 }}>商铺编辑</Typography.Title>

      <Card title="基础信息区（系统字段只读）">
        <Descriptions bordered column={3} items={Object.entries(shopEditMock.overview).map(([label, value]) => ({ key: label, label, children: value }))} />
      </Card>

      <div className="detail-section-nav-wrap" style={{ position: 'sticky', top: 88, zIndex: 20 }}>
        <div className="detail-section-nav">{navItems.map(([k, t]) => <button key={k} type="button" className={`detail-section-nav-item ${activeSection === k ? 'active' : ''}`} onClick={() => document.getElementById(k)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{t}</button>)}</div>
      </div>

      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={onSubmit}>
        <Card id="keys" title="商铺主键与关联信息区">
          <Row gutter={16}>
            <Col span={8}><Form.Item name="SID" label="SID"><Input disabled /></Form.Item></Col>
            <Col span={8}><Form.Item name="所属企业编号（CID）" label="所属企业编号（CID）"><Input disabled /></Form.Item></Col>
            <Col span={8}><Form.Item name="所属企业名称" label="所属企业名称"><Input disabled /></Form.Item></Col>
            <Col span={8}><Form.Item name="默认主联系人人员ID" label="默认主联系人人员ID"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="上级商铺ID" label="上级商铺ID"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="所属地区" label="所属地区"><Input disabled /></Form.Item></Col>
            <Col span={8}><Form.Item name="服务通道" label="服务通道"><Input disabled /></Form.Item></Col>
          </Row>
        </Card>

        <Card id="names" title="商铺名称信息区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={8}><Form.Item name="商铺中文名称" label="商铺中文名称" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={8}><Form.Item name="商铺英文名称" label="商铺英文名称"><Input /></Form.Item></Col><Col span={8}><Form.Item name="门头名称" label="门头名称" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={8}><Form.Item name="收据显示名称" label="收据显示名称" rules={[{ required: true }]}><Input /></Form.Item></Col></Row></Card>
        <Card id="operation" title="商铺主体与经营信息区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={8}><Form.Item name="商铺类型" label="商铺类型"><Select options={[{ value: '线下门店' }, { value: '网店' }, { value: '活动店' }]} /></Form.Item></Col><Col span={8}><Form.Item name="经营模式" label="经营模式"><Select options={[{ value: '直营' }, { value: '加盟' }, { value: '连锁' }]} /></Form.Item></Col><Col span={8}><Form.Item name="行业分类 / 业务性质 / 产品服务" label="行业分类 / 业务性质 / 产品服务"><Input /></Form.Item></Col><Col span={8}><Form.Item name="MCC Code" label="MCC Code"><Input /></Form.Item></Col></Row></Card>
        <Card id="basic" title="商铺基础经营数据区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={8}><Form.Item name="進件通道(必須)" label="進件通道(必須)"><Input /></Form.Item></Col><Col span={8}><Form.Item name="每宗交易平均金額" label="每宗交易平均金額"><Input /></Form.Item></Col><Col span={8}><Form.Item name="每宗交易最大交易額" label="每宗交易最大交易額"><Input /></Form.Item></Col><Col span={8}><Form.Item name="預計每年交易宗數" label="預計每年交易宗數"><Input /></Form.Item></Col></Row></Card>
        <Card id="contact" title="商铺联系信息区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={8}><Form.Item name="商铺电话" label="商铺电话"><Input /></Form.Item></Col><Col span={8}><Form.Item name="管理员电邮" label="管理员电邮"><Input /></Form.Item></Col><Col span={8}><Form.Item name="运营电邮" label="运营电邮"><Input /></Form.Item></Col></Row></Card>
        <Card id="address" title="商铺地址信息区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={12}><Form.Item name="门店地址（原始全文）" label="门店地址（原始全文）"><Input /></Form.Item></Col><Col span={6}><Form.Item name="门店地址-城市" label="门店地址-城市"><Input /></Form.Item></Col><Col span={6}><Form.Item name="门店地址-国家" label="门店地址-国家"><Input /></Form.Item></Col></Row></Card>
        <Card id="files" title="商铺文件信息区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={12}><Form.Item name="门头照片" label="门头照片"><Input /></Form.Item></Col><Col span={12}><Form.Item name="营业场所证明" label="营业场所证明"><Input /></Form.Item></Col></Row></Card>
        <Card id="risk" title="风控 / 业务信息区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={8}><Form.Item name="風控類型" label="風控類型"><Input /></Form.Item></Col><Col span={8}><Form.Item name="風險等級" label="風險等級"><Input /></Form.Item></Col><Col span={8}><Form.Item name="審核類型" label="審核類型"><Input /></Form.Item></Col><Col span={8}><Form.Item name="上單來源" label="上單來源"><Select mode="multiple" options={[{ value: 'CRM' }, { value: 'DMO' }, { value: 'SaaS' }, { value: '其他' }]} /></Form.Item></Col></Row></Card>

        <Card title="关联企业信息展示区" style={{ marginTop: 16 }}><Table rowKey="cid" pagination={false} dataSource={shopEditMock.relatedEnterprise} columns={[{ title: '企业名称', dataIndex: 'name' }, { title: '企业编号', dataIndex: 'cid' }, { title: '地区', dataIndex: 'region' }, { title: '启用状态', dataIndex: 'enableStatus' }, { title: '审核状态', dataIndex: 'reviewStatus' }, { title: '操作', render: () => <Button type="link">查看详情</Button> }]} /></Card>
        <Card title="关联 MID 信息展示区" style={{ marginTop: 16 }}><Table rowKey="mid" pagination={false} dataSource={shopEditMock.relatedMid} columns={[{ title: 'MID 编号', dataIndex: 'mid' }, { title: '第三方渠道 MID', dataIndex: 'thirdMid' }, { title: '服务通道', dataIndex: 'channel' }, { title: '当前状态', dataIndex: 'status' }, { title: '更新时间', dataIndex: 'updatedAt' }, { title: '操作', render: () => <Button type="link">查看详情</Button> }]} /></Card>
        <Card
          title="关联终端设备信息展示区"
          style={{ marginTop: 16 }}
          extra={<Space><Button>增加设备</Button><Button>回收设备</Button></Space>}
        >
          <Table rowKey="model" pagination={false} dataSource={shopEditMock.relatedDevices} columns={[{ title: '设备型号', dataIndex: 'model' }, { title: '设备分类', dataIndex: 'category' }, { title: '数量', dataIndex: 'quantity' }, { title: '绑定状态', dataIndex: 'bindStatus' }, { title: '更新时间', dataIndex: 'updatedAt' }]} />
        </Card>

        <div className="sticky-bottom-actions" style={{ position: 'sticky', bottom: 0, zIndex: 30, marginTop: 16 }}>
          <Space><Button type="primary" htmlType="submit">保存并提交审核</Button><Button onClick={() => navigate(-1)}>取消</Button></Space>
        </div>
      </Form>
    </Space>
  );
};
