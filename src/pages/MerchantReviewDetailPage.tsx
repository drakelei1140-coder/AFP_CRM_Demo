import { Alert, Button, Card, Descriptions, Drawer, Form, Select, Space, Table, Tag, Timeline, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductRateTable, buildRateRows, type ProductRateRow } from '../components/ProductRateTable';

type MerchantStatus = '待审核' | '基础资料审核' | '风控核查' | '风控审核完成';
type EntityStatus = '待审核' | '待风控审核' | '审核通过' | '审核不通过';

interface DetailRecord {
  id: string;
  overview: Record<string, string>;
  merchantStatus: MerchantStatus;
  channels: string[];
  enterprise: { summary: Record<string, string>; status: EntityStatus; reviewer: string };
  shop: { summary: Record<string, string>; status: EntityStatus; reviewer: string };
  settlement: Record<string, string>;
  timeline: Array<{ time: string; operator: string; target: string; action: string; summary: string; remark: string }>;
}

const seed: DetailRecord = {
  id: 'm-2',
  merchantStatus: '基础资料审核',
  channels: ['Adyen_AFP'],
  overview: { MID: 'MID-002', CID: 'CID-101', SID: 'SID-10002', 渠道编码: 'ADY_AFP', 服务编码: 'POS_CORE', 进件通道: 'Adyen_AFP', 商户审核状态: '基础资料审核', 当前审核人: 'OPS-Ryan', 上單來源: 'DMO', 创建时间: '2026-04-02 12:00:00', 更新时间: '2026-04-03 15:00:00' },
  enterprise: { status: '待风控审核', reviewer: 'Risk-Team-A', summary: { 企业主显示名称: 'HK Food Group', CID: 'CID-101', 企业启用状态: '-', 企业审核状态: '待风控审核', 公司模式: '连锁', 法律地位: '有限公司', 行业分类: '餐饮' } },
  shop: { status: '待风控审核', reviewer: 'Risk-Team-B', summary: { 商铺主显示名称: '旺角站前店', SID: 'SID-10002', 所属企业名称: 'HK Food Group', 商铺启用状态: '-', 商铺审核状态: '待风控审核', 商铺类型: '线下门店', 经营模式: '直营' } },
  settlement: { 結算週期: 'D+1', 結算幣種: 'HKD', 打款銀行: 'DBS', FPS賬號: 'FPS-9002', 收款銀行賬戶名稱: 'HK Food Group Ltd' },
  timeline: [{ time: '2026-04-03 15:00:00', operator: 'OPS-Ryan', target: '商户', action: '进入基础资料审核', summary: '开始核查并接手审核', remark: '-' }]
};

const navItems = [
  ['overview', '概览'], ['keys', '主键与关联信息'], ['enterprise', '企业审核信息'], ['shop', '商铺审核信息'], ['settlement', '结算与银行信息'], ['productRate', '产品费率'], ['timeline', '修改记录时间轴']
] as const;

export const MerchantReviewDetailPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<DetailRecord>(seed);
  const [rates] = useState<ProductRateRow[]>(buildRateRows());
  const [active, setActive] = useState('overview');
  const [enterpriseDrawer, setEnterpriseDrawer] = useState(false);
  const [shopDrawer, setShopDrawer] = useState(false);

  const blocked = data.enterprise.status !== '审核通过' || data.shop.status !== '审核通过';

  useEffect(() => {
    const nodes = navItems.map(([k]) => document.getElementById(k)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const cur = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (cur?.target?.id) setActive(cur.target.id);
    }, { rootMargin: '-170px 0px -65% 0px', threshold: [0.1, 0.3, 0.6] });
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [data.id]);

  const topActions = useMemo(() => [
    <Button key="edit" onClick={() => navigate(`/merchants/${id}/edit`)}>编辑</Button>,
    <Button key="submit" type="primary" disabled={blocked} onClick={() => setData((p) => ({ ...p, merchantStatus: '风控审核完成' }))}>审核通过</Button>
  ], [blocked, id, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <Card id="overview"><Descriptions column={3} bordered size="small" items={Object.entries(data.overview).map(([k, v]) => ({ key: k, label: k, children: k === '商户审核状态' ? <Tag color="default">{data.merchantStatus}</Tag> : v || '-' }))} /></Card>
      <Card><Space wrap>{topActions}</Space></Card>
      {blocked && <Alert type="warning" showIcon message="企业与商铺未全部完成审核通过，暂不可完成商户审核" />}

      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{navItems.map(([k, t]) => <button key={k} type="button" className={`detail-section-nav-item ${active === k ? 'active' : ''}`} onClick={() => document.getElementById(k)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{t}</button>)}</div></div>

      <Card id="keys" title="主键与关联信息区"><Descriptions bordered column={3} size="small" items={Object.entries(data.overview).filter(([k]) => ['MID', 'CID', 'SID', '渠道编码', '服务编码', '进件通道'].includes(k)).map(([k, v]) => ({ key: k, label: k, children: v }))} /></Card>
      <Card id="enterprise" title="企业审核信息区" extra={<Space><Button type="link" onClick={() => window.open(`/enterprises/${data.overview.CID}`, '_blank')}>查看详情</Button><Button type="link" onClick={() => setEnterpriseDrawer(true)}>审核</Button></Space>}><Descriptions bordered column={3} size="small" items={Object.entries(data.enterprise.summary).map(([k, v]) => ({ key: k, label: k, children: v || '-' }))} /></Card>
      <Card id="shop" title="商铺审核信息区" extra={<Space><Button type="link" onClick={() => window.open(`/shops/${data.overview.SID}`, '_blank')}>查看详情</Button><Button type="link" onClick={() => setShopDrawer(true)}>审核</Button></Space>}><Descriptions bordered column={3} size="small" items={Object.entries(data.shop.summary).map(([k, v]) => ({ key: k, label: k, children: v || '-' }))} /></Card>
      <Card id="settlement" title="结算与银行信息区"><Descriptions bordered column={3} size="small" items={Object.entries(data.settlement).map(([k, v]) => ({ key: k, label: k, children: v || '-' }))} /></Card>

      <Card id="productRate" title="产品费率区"><ProductRateTable value={rates} /></Card>
      <Card id="timeline" title="修改记录时间轴区"><Timeline items={data.timeline.map((t) => ({ children: `${t.time} | ${t.operator} | ${t.target} | ${t.action} | ${t.summary} | ${t.remark}` }))} /></Card>

      <Drawer open={enterpriseDrawer} onClose={() => setEnterpriseDrawer(false)} title="企业审核" width={420} footer={<Space><Button onClick={() => { setData((p) => ({ ...p, enterprise: { ...p.enterprise, status: '审核不通过' } })); setEnterpriseDrawer(false); }}>审核驳回</Button><Button type="primary" onClick={() => { setData((p) => ({ ...p, enterprise: { ...p.enterprise, status: '审核通过' } })); setEnterpriseDrawer(false); }}>审核通过</Button></Space>}>
        <Descriptions column={1} bordered items={[{ key: 'name', label: '企业', children: data.enterprise.summary['企业主显示名称'] }, { key: 'status', label: '当前状态', children: data.enterprise.status }]} />
      </Drawer>
      <Drawer open={shopDrawer} onClose={() => setShopDrawer(false)} title="商铺审核" width={420} footer={<Space><Button onClick={() => { setData((p) => ({ ...p, shop: { ...p.shop, status: '审核不通过' } })); setShopDrawer(false); }}>审核驳回</Button><Button type="primary" onClick={() => { setData((p) => ({ ...p, shop: { ...p.shop, status: '审核通过' } })); setShopDrawer(false); }}>审核通过</Button></Space>}>
        <Descriptions column={1} bordered items={[{ key: 'name', label: '商铺', children: data.shop.summary['商铺主显示名称'] }, { key: 'status', label: '当前状态', children: data.shop.status }]} />
      </Drawer>
    </div>
  );
};
