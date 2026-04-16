import { Button, Card, Descriptions, Space, Table, Timeline, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { shopFieldGroups } from '../config/fieldSchemas';

const detail = {
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
  terminalDevices: [{ model: 'V400m', quantity: 4, bindStatus: '已绑定' }],
  relatedEnterprise: [{ name: 'HK Food Group', cid: 'CID-101' }],
  relatedMid: [{ mid: 'MID-7701', channel: 'Adyen-AFP' }],
  timeline: [{ time: '2026-04-01 10:00:00', action: '创建商铺待审核' }]
};

export const ShopDetailPage = () => {
  const navigate = useNavigate();
  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Card><Typography.Title level={3} style={{ margin: 0 }}>{detail.valueMap['商铺中文名称']}</Typography.Title><Space><Typography.Text>SID: {detail.valueMap.SID}</Typography.Text><Button onClick={() => navigate(`/shops/${detail.id}/edit`)}>编辑</Button></Space></Card>
      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{shopFieldGroups.map((g) => <button type="button" key={g.key} className="detail-section-nav-item" onClick={() => document.getElementById(g.key)?.scrollIntoView({ behavior: 'smooth' })}>{g.title}</button>)}</div></div>
      {shopFieldGroups.map((group) => <Card key={group.key} id={group.key} title={group.title}><Descriptions column={3} bordered items={group.fields.map((f) => ({ key: f, label: f, children: detail.valueMap[f as keyof typeof detail.valueMap] || '-' }))} /></Card>)}
      <Card title="终端设备"><Table rowKey="model" pagination={false} dataSource={detail.terminalDevices} columns={[{ title: '设备型号', dataIndex: 'model' }, { title: '数量', dataIndex: 'quantity' }, { title: '绑定状态', dataIndex: 'bindStatus' }]} /></Card>
      <Card title="关联企业"><Table rowKey="cid" pagination={false} dataSource={detail.relatedEnterprise} columns={[{ title: '企业名称', dataIndex: 'name' }, { title: '企业编号（CID）', dataIndex: 'cid' }]} /></Card>
      <Card title="关联 MID"><Table rowKey="mid" pagination={false} dataSource={detail.relatedMid} columns={[{ title: 'MID 编号', dataIndex: 'mid' }, { title: '服务通道', dataIndex: 'channel' }]} /></Card>
      <Card title="修改记录时间轴"><Timeline items={detail.timeline.map((t) => ({ children: `${t.time} - ${t.action}` }))} /></Card>
    </Space>
  );
};
