import { Alert, Button, Card, Descriptions, Drawer, Space, Tag, Timeline } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductRateTable, buildRateRows, type ProductRateRow } from '../components/ProductRateTable';
import { merchantFieldGroups } from '../config/fieldSchemas';

const valueMap: Record<string, string> = {
  MID: 'MID-002', CID: 'CID-101', SID: 'SID-10002', 渠道编码: 'ADY_AFP', 服务编码: 'POS_CORE', 进件通道: 'Adyen_AFP',
  清算模式: 'T+1', 'Store参考号 / 门店编码': 'ST_REF_90002', H5支付域名: 'https://pay.shop.demo', 結算摘要前綴: 'KPAY', 卡類型: 'VISA/MC', 結算身份證號: 'A123456(7)',
  結算週期: 'D+1', 結算幣種: 'HKD', 打款銀行: 'DBS', FPS賬號: 'FPS-9002', 收款銀行賬戶名稱: 'HK Food Group Ltd', 通道列表: 'Adyen_AFP'
};

export const MerchantReviewDetailPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [rates] = useState<ProductRateRow[]>(buildRateRows());
  const [enterpriseDrawer, setEnterpriseDrawer] = useState(false);
  const [shopDrawer, setShopDrawer] = useState(false);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Card><Space><Tag color="default">基础资料审核</Tag><Button onClick={() => navigate(`/merchants/${id}/edit`)}>编辑</Button></Space></Card>
      <Alert type="warning" showIcon message="企业与商铺未全部审核通过时，商户不可完成审核。" />
      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{merchantFieldGroups.map((g) => <button type="button" key={g.key} className="detail-section-nav-item" onClick={() => document.getElementById(g.key)?.scrollIntoView({ behavior: 'smooth' })}>{g.title}</button>)}</div></div>

      {merchantFieldGroups.map((group) => (
        <Card id={group.key} key={group.key} title={group.title}><Descriptions column={3} bordered items={group.fields.map((field) => ({ key: field, label: field, children: valueMap[field] || '-' }))} /></Card>
      ))}
      <Card title="企业审核信息区" extra={<Space><Button type="link">查看详情</Button><Button type="link" onClick={() => setEnterpriseDrawer(true)}>审核</Button></Space>}><div>企业：HK Food Group（CID-101）</div></Card>
      <Card title="商铺审核信息区" extra={<Space><Button type="link">查看详情</Button><Button type="link" onClick={() => setShopDrawer(true)}>审核</Button></Space>}><div>商铺：旺角站前店（SID-10002）</div></Card>
      <Card title="产品费率区"><ProductRateTable value={rates} /></Card>
      <Card title="修改记录时间轴"><Timeline items={[{ children: '2026-04-03 15:00:00 | OPS-Ryan | 进入基础资料审核' }]} /></Card>

      <Drawer open={enterpriseDrawer} onClose={() => setEnterpriseDrawer(false)} title="企业审核" width={420}>
        <Button type="primary" onClick={() => setEnterpriseDrawer(false)}>审核通过</Button>
      </Drawer>
      <Drawer open={shopDrawer} onClose={() => setShopDrawer(false)} title="商铺审核" width={420}>
        <Button type="primary" onClick={() => setShopDrawer(false)}>审核通过</Button>
      </Drawer>
    </Space>
  );
};
