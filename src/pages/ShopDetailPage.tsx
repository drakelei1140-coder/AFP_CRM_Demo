import { Button, Card, Col, Descriptions, Input, Modal, Row, Space, Table, Timeline, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type ReviewStatus = '待审核' | '待风控审核' | '审核通过' | '审核不通过';
type EnableStatus = '启用' | '停用' | null;

interface ShopDetail {
  id: string;
  name: string;
  sid: string;
  cid: string;
  enterpriseName: string;
  enableStatus: EnableStatus;
  reviewStatus: ReviewStatus;
  channels: string[];
  sections: Record<string, Record<string, string>>;
  terminalDevices: Array<{ model: string; category: string; quantity: number; bindStatus: string }>;
  relatedEnterprise: Array<{ name: string; cid: string; enableStatus: string; reviewStatus: string; contact: string; relation: string }>;
  relatedMid: Array<{ mid: string; thirdMid: string; channel: string; status: string; settlementTag: string; updatedAt: string }>;
  timeline: Array<{ time: string; operator: string; action: string; summary: string; remark?: string }>;
}

const seed: ShopDetail = {
  id: 'shop-1', name: '尖沙咀旗舰店', sid: 'SID-10001', cid: 'CID-101', enterpriseName: 'HK Food Group', enableStatus: null, reviewStatus: '待审核', channels: ['Adyen-AFP'],
  sections: {
    keys: { SID: 'SID-10001', '所属企业编号（CID）': 'CID-101', '所属企业名称': 'HK Food Group', '默认主联系人人员ID': 'P-1001', '上级商铺ID': '-', '所属地区': 'HK', '服务通道': 'Adyen-AFP' },
    names: { '商铺中文名称': '尖沙咀旗舰店', '商铺英文名称': 'TST Flagship Store', '门头名称': 'KPay TST', '收据显示名称': 'KPay-TST' },
    operation: { '商铺类型': '线下门店', '经营模式': '直营', '行业分类 / 业务性质 / 产品服务': '餐饮, 咖啡', 'MCC Code': '5812' },
    basic: { '進件通道(必須)': 'Adyen-AFP', '每宗交易平均金額': '300', '每宗交易最大交易額': '2800', '預計每年交易宗數': '220000' },
    contact: { '商铺电话': '+852 2123 8888', '管理员电邮': 'admin@shop.demo', '运营电邮': 'ops@shop.demo' },
    address: { '门店地址（原始全文）': '香港尖沙咀海港城 3F 301', '门店地址-城市': 'Hong Kong', '门店地址-国家': 'HK' },
    files: { '门头照片': 'head_sign.jpg', '营业场所证明': 'business_proof.pdf' },
    risk: { '風控類型': '标准', '風險等級': '低', '審核類型': '新建审核', '上單來源': 'CRM' }
  },
  terminalDevices: [{ model: 'V400m', category: 'POS', quantity: 4, bindStatus: '已绑定' }],
  relatedEnterprise: [{ name: 'HK Food Group', cid: 'CID-101', enableStatus: '启用', reviewStatus: '审核通过', contact: 'Wong Ken', relation: '所属企业' }],
  relatedMid: [{ mid: 'MID-7701', thirdMid: 'ADY-99311', channel: 'Adyen-AFP', status: 'Active', settlementTag: 'SETTLE-01', updatedAt: '2026-04-10 10:00:00' }],
  timeline: [{ time: '2026-04-01 10:00:00', operator: 'OPS-Lily', action: '创建', summary: '创建商铺待审核', remark: '-' }]
};

const sectionNav = [
  ['overview', '商铺概览'], ['keys', '商铺主键与关联'], ['names', '商铺名称信息'], ['operation', '商铺主体与经营信息'], ['basic', '商铺基础经营数据'],
  ['contact', '商铺联系信息'], ['address', '商铺地址信息'], ['files', '商铺文件信息'], ['risk', '风控 / 业务信息'], ['devices', '终端设备'], ['enterprise', '关联企业'], ['mid', '关联 MID'], ['timeline', '修改记录时间轴']
] as const;

export const ShopDetailPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState<ShopDetail>(seed);
  const [active, setActive] = useState('overview');
  const [comment, setComment] = useState('');

  useEffect(() => {
    const nodes = sectionNav.map(([k]) => document.getElementById(k)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current?.target.id) setActive(current.target.id);
    }, { rootMargin: '-180px 0px -65% 0px', threshold: [0.1, 0.3, 0.6] });
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [shop.id]);

  const actions = useMemo(() => {
    if (shop.reviewStatus === '待审核') return [<Button key="edit" onClick={() => navigate(`/shops/${id}/edit`)}>编辑</Button>, <Button key="pass" type="primary" onClick={() => Modal.confirm({ title: '审核通过（OPS）', content: <Input.TextArea rows={3} onChange={(e) => setComment(e.target.value)} />, onOk: () => setShop((p) => ({ ...p, reviewStatus: '审核通过', enableStatus: '启用', timeline: [{ time: new Date().toISOString(), operator: '当前登录用户', action: '审核通过', summary: comment || '-', remark: '-' }, ...p.timeline] })) })}>审核通过（OPS）</Button>];
    if (shop.reviewStatus === '审核通过') return [<Button key="edit" onClick={() => navigate(`/shops/${id}/edit`)}>编辑</Button>, <Button key="toggle" onClick={() => setShop((p) => ({ ...p, enableStatus: p.enableStatus === '启用' ? '停用' : '启用' }))}>{shop.enableStatus === '启用' ? '停用' : '启用'}</Button>];
    return [<Button key="resubmit" type="primary">重新提交审核</Button>];
  }, [comment, id, navigate, shop.enableStatus, shop.reviewStatus]);

  return (
    <div style={{ width: '100%' }}>
      <Card id="overview" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}><Col span={18}><Typography.Title level={3} style={{ margin: 0 }}>{shop.name}</Typography.Title><Space wrap><Typography.Text>SID: {shop.sid}</Typography.Text><Typography.Text>所属企业: {shop.enterpriseName} / {shop.cid}</Typography.Text><Typography.Text>审核状态: {shop.reviewStatus}</Typography.Text><Typography.Text>启用状态: {shop.enableStatus || '-'}</Typography.Text></Space></Col><Col span={6}><Card size="small"><Typography.Text>终端设备数量: {shop.terminalDevices.length}</Typography.Text></Card></Col></Row>
          <Space wrap>{actions}</Space>
        </Space>
      </Card>

      <div className="detail-section-nav-wrap" style={{ marginBottom: 16 }}><div className="detail-section-nav">{sectionNav.map(([k, t]) => <button key={k} type="button" className={`detail-section-nav-item ${active === k ? 'active' : ''}`} onClick={() => document.getElementById(k)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{t}</button>)}</div></div>

      {Object.entries(shop.sections).map(([k, section]) => <Card key={k} id={k} title={sectionNav.find((item) => item[0] === k)?.[1]} style={{ marginBottom: 16 }}><Descriptions column={3} bordered size="small" items={Object.entries(section).map(([label, value]) => ({ key: label, label, children: value || '-' }))} /></Card>)}
      <Card id="devices" title="终端设备" style={{ marginBottom: 16 }}><Table rowKey="model" pagination={false} dataSource={shop.terminalDevices} columns={[{ title: '设备型号', dataIndex: 'model' }, { title: '设备分类', dataIndex: 'category' }, { title: '数量', dataIndex: 'quantity' }, { title: '绑定状态', dataIndex: 'bindStatus' }]} /></Card>
      <Card id="enterprise" title="关联企业" style={{ marginBottom: 16 }}><Table rowKey="cid" pagination={false} dataSource={shop.relatedEnterprise} columns={[{ title: '企业名称', dataIndex: 'name' }, { title: '企业编号（CID）', dataIndex: 'cid' }, { title: '企业启用状态', dataIndex: 'enableStatus' }, { title: '企业审核状态', dataIndex: 'reviewStatus' }]} /></Card>
      <Card id="mid" title="关联 MID" style={{ marginBottom: 16 }}><Table rowKey="mid" pagination={false} dataSource={shop.relatedMid} columns={[{ title: 'MID 编号', dataIndex: 'mid' }, { title: '第三方渠道 MID', dataIndex: 'thirdMid' }, { title: '服务通道', dataIndex: 'channel' }, { title: '当前状态', dataIndex: 'status' }, { title: '更新时间', dataIndex: 'updatedAt' }]} /></Card>
      <Card id="timeline" title="修改记录时间轴" style={{ marginBottom: 16 }}><Timeline items={shop.timeline.map((item) => ({ children: `${item.time} | ${item.operator} | ${item.action} | ${item.summary}` }))} /></Card>
    </div>
  );
};
