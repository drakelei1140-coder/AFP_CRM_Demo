import { Alert, Button, Card, Descriptions, Divider, Drawer, Form, Input, Select, Space, Tag, Timeline, Typography, message } from 'antd';
import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type MerchantStatus = '待审核' | '基础资料审核' | '销售主管审核' | '风控核查' | '风控初级审核' | '风控中级审核' | '总经理审核' | '风控审核完成';
type EntityStatus = '待审核' | '待风控审核' | '审核通过' | '审核不通过';

interface DetailRecord {
  id: string;
  overview: Record<string, string>;
  merchantStatus: MerchantStatus;
  riskCheckStage?: 1 | 2;
  channels: string[];
  enterprise: { summary: Record<string, string>; status: EntityStatus; reviewer: string };
  shop: { summary: Record<string, string>; status: EntityStatus; reviewer: string };
  sections: Record<string, Record<string, string>>;
  timeline: Array<{ time: string; operator: string; target: string; action: string; summary: string; remark: string }>;
}

const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

const seed: Record<string, DetailRecord> = {
  'm-2': {
    id: 'm-2',
    merchantStatus: '基础资料审核',
    channels: ['ADY_PAYFAC'],
    overview: {
      MID: 'MID-002', CID: 'CID-101', SID: 'SID-10002', 渠道编码: 'ADY_PAYFAC', 服务编码: 'POS_CORE, POS_EXT', 进件通道: 'Adyen-payfac', 商户审核状态: '基础资料审核', 当前审核人: 'OPS-Ryan', 上單來源: 'DMO', 创建人: 'DMO', 创建时间: '2026-04-02 12:00:00', 更新时间: '2026-04-03 15:00:00', 'AFP Store ID': 'ST_AFP_90002', 'AFP merchant account ID': 'MA_009002'
    },
    enterprise: {
      status: '待风控审核', reviewer: 'Risk-Team-A',
      summary: {
        企业主显示名称: 'HK Food Group', CID: 'CID-101', '企业 LE ID': 'LE-90001', 企业启用状态: '-', 企业审核状态: '待风控审核', '進件通道(必須)': 'Adyen-payfac', 上單來源: 'DMO', 創建時間: '2026-03-01 10:00:00', 更新時間: '2026-04-03 09:00:00', 公司模式: '连锁', 公司結構: '有限公司', '行業分類 / 業務性質 / 產品服務': '餐饮', 'MCC Code': '5812', '進階MCC Code': '5812A', 小微商戶: '否', 'SME 設定': '是', 法律地位: '有限公司', 僱員人數: '186', 注冊資本: 'HKD 5,000,000', 企业税务申报分类: '一般纳税', 企业税务业务类型: '本地销售', 平均每月營業額: 'HKD 2,600,000', 每宗交易平均金額: '320', 每宗交易最大交易額: '2400', 預計每年交易宗數: '280000', 過往拒付比例: '0.18%', 過往退款比例: '0.42%', 提前收款日數: '1', '貨物 / 服務最短送達時間': '即时', '貨物 / 服務最長送達時間': '3天', 是否對公: '是', 合約期: '24个月', 是否NGO: '否', '商戶營業狀態（企業口徑）': '营业中', 風控類型: '标准', 風險等級: '低', 審核類型: '新建审核', 服務類型: '收单', 合作夥伴推薦人: 'Tom Lee', 合作夥伴編號: 'PT-2201', 交單備註: '资料齐全', 是否高額商戶: '否'
      }
    },
    shop: {
      status: '待风控审核', reviewer: 'Risk-Team-B',
      summary: {
        商铺主显示名称: '旺角站前店', SID: 'SID-10002', 所属企业名称: 'HK Food Group', '所属企业编号（CID）': 'CID-101', 'Store ID': 'STORE-90002', 商铺启用状态: '-', 商铺审核状态: '待风控审核', 终端设备数量: '4', 'MID 数量': '1', '進件通道(必須)': 'Adyen-payfac', 上單來源: 'DMO', 創建時間: '2026-04-02 11:00:00', 更新時間: '2026-04-03 16:30:00', 商铺类型: '线下门店', 经营模式: '直营', 是否总部: '否', 是否默认主门店: '否', '行业分类 / 业务性质 / 产品服务': '餐饮', 'MCC Code': '5812', '進階MCC Code': '5812A', 开店日期: '2021-02-01', 商铺营业状态: '营业中', 经营年限: '4', 小微商戶: '否', 'SME 設定': '是', 是否NGO: '否', 每宗交易平均金額: '260', 每宗交易最大交易額: '2200', 預計每年交易宗數: '180000', 過往拒付比例: '0.20%', 過往退款比例: '0.35%', 平均每月營業額: 'HKD 1,800,000', 提前收款日數: '1', '貨物 / 服務最短送達時間': '即时', '貨物 / 服務最長送達時間': '2天', 是否對公: '是', 合約期: '24个月', 小費功能: '是', '商戶營業狀態（商铺口徑）': '营业中', 風控類型: '标准', 風險等級: '低', 審核類型: '新建审核', 服務類型: '线下收单', 合作夥伴推薦人: 'Tom Lee', 合作夥伴編號: 'PT-2201', 交單備註: '待风控', 是否高額商戶: '否'
      }
    },
    sections: {
      keys: { MID: 'MID-002', CID: 'CID-101', SID: 'SID-10002', 渠道编码: 'ADY_PAYFAC', 服务编码: 'POS_CORE, POS_EXT' },
      flow: { 商户审核状态: '基础资料审核', 当前审核人: 'OPS-Ryan', 上單來源: 'DMO', 创建人: 'DMO', 创建时间: '2026-04-02 12:00:00', 更新时间: '2026-04-03 15:00:00', 当前风险等级: '低', 当前风险评分表状态: '未开始', 是否存在在途特殊费率申请: '是', 特殊费率申请结果: '处理中', 特殊费率申请完成时间: '-' },
      channelAfp: { 'AFP Store ID': 'ST_AFP_90002', 'AFP Store参考号 / 门店编码': 'ST_REF_90002', 'AFP merchant account ID': 'MA_009002', 'AFP Store状态': 'active', 'AFP Store shopper statement': 'KPay MK', 'AFP Store本地对账单脚本': '-', 'AFP Store本地对账单文本': '-', 'AFP Store外部参考号': 'EXT-90002', 'AFP Store分账目标BA ID': 'BA-001', 'AFP Store分账配置ID': 'SPLIT-001', 'AFP sub-merchant email': 'mk@shop.demo', 'AFP sub-merchant scheme id': 'SCHEME-01', 'AFP sub-merchant MCC': '5812', 'AFP sub-merchant name': 'MK Store', H5支付域名: 'https://pay.shop.demo', 清算模式: 'T+1', 'Store参考号 / 门店编码': 'ST_REF_90002' },
      settlement: { 結算週期: 'D+1', 結算幣種: 'HKD', NP結算週期: 'D+1', 打款銀行: 'DBS', FPS賬號: 'FPS-9002', 收款銀行賬戶名稱: 'HK Food Group Ltd', 銀行名稱: 'DBS HK', 銀行號碼: '012', 銀行編號: '1002', 結算摘要前綴: 'KPAY', 卡類型: 'VISA/MC', 結算身份證號: 'A123456(7)', 銀行卡歸屬國: 'HK', 銀行卡歸屬省: '-', '一份銀行戶口月結單（最近三個月內銀行發出的）': 'bank_statement.pdf', 'FPS-DBS 申請文件': 'fps_dbs.pdf' },
      product: { 產品開通: 'POS, Settlement', 使用費率模板: 'TPL-01', 沒有合適的費率模板: '否', 'VISA 收單-消費': '开通', 'MASTERCARD 收單-消費': '开通', 'AMERICAEXPRESS 收單-消費': '关闭', 'UNIONPAY 收單-消費': '开通', 'JCB 收單-消費': '关闭', 'DINERSCLUB 收單-消費': '关闭', '收單-預授權': '开通', 'VISA 收單-分期消費': '关闭', 'MASTERCARD 收單-分期消費': '关闭', '微信支付-正掃': '开通', '微信支付-反掃': '开通', '支付寶-正掃': '开通', '支付寶-反掃': '开通', '微信支付-靜態二維碼': '开通', '支付寶-靜態二維碼': '开通', 二維碼支付: '开通', '微信APP支付（缐上）': '关闭', '微信H5支付（缐上）': '关闭', '微信小程序支付（缐上）': '关闭', '支付寶H5支付（缐上）': '关闭', '支付寶App支付（缐上）': '关闭', '支付寶WEB支付（缐上）': '关闭', 八達通申請簽名: 'octopus_sign.pdf', 八達通授權書: 'octopus_auth.pdf', 現有八達通服務終止日期: '-', 按金收取憑證: 'deposit_receipt.pdf' },
      baPm: { '余额账户ID': 'BA-001', '余额账户关联AH ID': 'AH-001', '余额账户描述': 'Main BA', '余额账户参考号': 'BA-REF-001', 默认币种: 'HKD', '打款 / 结算计划': 'daily', 打款工具ID: 'TI-001', '打款工具关联LE ID': 'LE-90001', 银行账户国家: 'HK', '银行代码 / 分行代码': '012/001', 银行账户持有人姓名: 'HK Food Group Ltd', 支付方式产品配置: 'PM-CONF-001', 费率模板ID: 'TPL-01', 自定义费率: '否', 鏈接方式: 'API', 收款連結: 'https://pay.link/demo' },
      specialRate: { 是否存在在途特殊费率申请: '是', 特殊费率申请单号: 'SPR-202604-001', 特殊费率申请状态: '审批中', 特殊费率申请结果: '-', 特殊费率申请完成时间: '-' }
    },
    timeline: [{ time: '2026-04-03 15:00:00', operator: 'OPS-Ryan', target: '商户', action: '进入基础资料审核', summary: '开始核查并接手审核', remark: '-' }]
  }
};

const navItems = [
  ['overview', '概览'], ['keys', '主键与关联信息'], ['flow', '审核流转信息'], ['enterprise', '企业审核信息'], ['shop', '商铺审核信息'],
  ['channelAfp', '渠道与 AFP Store 信息'], ['settlement', '结算与银行信息'], ['product', '产品与支付方式信息'], ['baPm', 'BA / Transfer Instrument / PM 信息'], ['specialRate', '特殊费率申请信息'], ['timeline', '修改记录时间轴']
] as const;

const merchantStatusTagStyles: Record<MerchantStatus, CSSProperties> = {
  待审核: { background: '#FFF7E6', borderColor: '#FFD591', color: '#D48806' },
  基础资料审核: { background: '#EEF3FF', borderColor: '#B4C8FF', color: '#1D39C4' },
  销售主管审核: { background: '#F0F5FF', borderColor: '#ADC6FF', color: '#1D39C4' },
  风控核查: { background: '#FFFBE6', borderColor: '#FFE58F', color: '#D48806' },
  风控初级审核: { background: '#F6FFED', borderColor: '#B7EB8F', color: '#389E0D' },
  风控中级审核: { background: '#E6FFFB', borderColor: '#87E8DE', color: '#08979C' },
  总经理审核: { background: '#F9F0FF', borderColor: '#D3ADF7', color: '#531DAB' },
  风控审核完成: { background: '#F6FFED', borderColor: '#B7EB8F', color: '#237804' }
};

const reviewTag = (status: MerchantStatus) => <Tag style={merchantStatusTagStyles[status]}>{status}</Tag>;

export const MerchantReviewDetailPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<DetailRecord>(seed[id] || seed['m-2']);
  const [active, setActive] = useState('overview');
  const [enterpriseDrawer, setEnterpriseDrawer] = useState(false);
  const [shopDrawer, setShopDrawer] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const hasNonAfp = data.channels.some((c) => c !== 'ADY_AFP');
  const enterpriseDone = data.enterprise.status === '审核通过';
  const shopDone = data.shop.status === '审核通过';
  const blocked = hasNonAfp && (!enterpriseDone || !shopDone);
  const blockMsg = !blocked
    ? ''
    : !enterpriseDone && !shopDone
      ? '当前企业与商铺均未完成风控审核，暂不可完成商户审核'
      : !enterpriseDone
        ? '当前企业未完成风控审核，暂不可完成商户审核'
        : '当前商铺未完成风控审核，暂不可完成商户审核';

  useEffect(() => {
    const nodes = navItems.map(([k]) => document.getElementById(k)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const cur = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (cur?.target?.id) setActive(cur.target.id);
    }, { rootMargin: '-170px 0px -65% 0px', threshold: [0.1, 0.3, 0.6] });
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [data.id]);

  const appendTimeline = (action: string, summary: string, remark = '-') => {
    setData((prev) => ({
      ...prev,
      overview: { ...prev.overview, 更新时间: now(), 当前审核人: '当前登录用户', 商户审核状态: prev.merchantStatus },
      sections: { ...prev.sections, flow: { ...prev.sections.flow, 更新时间: now(), 当前审核人: '当前登录用户', 商户审核状态: prev.merchantStatus } },
      timeline: [{ time: now(), operator: '当前登录用户', target: '商户', action, summary, remark }, ...prev.timeline]
    }));
  };

  const setMerchantStatus = (status: MerchantStatus, action: string, summary: string) => {
    setData((prev) => ({
      ...prev,
      merchantStatus: status,
      overview: { ...prev.overview, 商户审核状态: status, 当前审核人: '当前登录用户', 更新时间: now() },
      sections: { ...prev.sections, flow: { ...prev.sections.flow, 商户审核状态: status, 当前审核人: '当前登录用户', 更新时间: now() } },
      timeline: [{ time: now(), operator: '当前登录用户', target: '商户', action, summary, remark: '-' }, ...prev.timeline]
    }));
  };

  const enterpriseAudit = (pass: boolean) => {
    setData((prev) => ({
      ...prev,
      enterprise: { ...prev.enterprise, status: pass ? '审核通过' : '审核不通过', reviewer: '当前登录用户' },
      timeline: [{ time: now(), operator: '当前登录用户', target: '企业', action: pass ? '审核通过' : '审核驳回', summary: '企业审核状态更新', remark: '-' }, ...prev.timeline]
    }));
    setEnterpriseDrawer(false);
  };

  const shopAudit = (pass: boolean) => {
    setData((prev) => ({
      ...prev,
      shop: { ...prev.shop, status: pass ? '审核通过' : '审核不通过', reviewer: '当前登录用户' },
      timeline: [{ time: now(), operator: '当前登录用户', target: '商铺', action: pass ? '审核通过' : '审核驳回', summary: '商铺审核状态更新', remark: '-' }, ...prev.timeline]
    }));
    setShopDrawer(false);
  };

  const topActions = useMemo(() => {
    const disabledByBlock = blocked;
    const editBtn = <Button key="edit" onClick={() => navigate(`/merchants/${data.id}/edit`)}>编辑</Button>;
    if (data.merchantStatus === '待审核') {
      return [editBtn, <Button key="start" type="primary" onClick={() => setMerchantStatus('基础资料审核', '开始核查', '进入基础资料审核')}>开始核查</Button>];
    }
    if (data.merchantStatus === '基础资料审核') {
      return [
        editBtn,
        <Button key="cancel">取消簽約</Button>,
        <Button key="copy">從已有商戶複製資料</Button>,
        <Button key="transfer" onClick={() => setTransferOpen(true)}>轉交審核</Button>,
        <Button key="submit" type="primary" disabled={disabledByBlock} onClick={() => setMerchantStatus('风控核查', '遞交審核', '提交至风控核查')}>遞交審核</Button>
      ];
    }
    if (data.merchantStatus === '风控核查') {
      if (data.riskCheckStage === 1) {
        return [editBtn, <Button key="startRisk" type="primary" onClick={() => setData((p) => ({ ...p, riskCheckStage: 2 }))}>开始核查</Button>];
      }
      return [
        editBtn,
        <Button key="notify">通知BD（OS补件）</Button>,
        <Button key="cancel">取消签约</Button>,
        <Button key="score" disabled={disabledByBlock}>风险评分风控核查</Button>,
        <Button key="rollback" onClick={() => setData((p) => ({ ...p, riskCheckStage: 1 }))}>退回审核</Button>,
        <Button key="transfer" onClick={() => setTransferOpen(true)}>转交审核</Button>,
        <Button key="toRisk1" type="primary" disabled={disabledByBlock} onClick={() => setMerchantStatus('风控初级审核', '递交风控', '流转风控初级审核')}>递交风控</Button>,
        <Button key="basicEval" disabled={disabledByBlock}>基础资料评定</Button>
      ];
    }
    if (data.merchantStatus === '风控初级审核' || data.merchantStatus === '风控中级审核' || data.merchantStatus === '总经理审核') {
      return [
        editBtn,
        <Button key="notify">通知BD（OS补件）</Button>,
        <Button key="cancel">取消签约</Button>,
        <Button key="back">退回审核</Button>,
        <Button key="transfer" onClick={() => setTransferOpen(true)}>转交审核</Button>,
        <Button key="pass" type="primary" disabled={disabledByBlock} onClick={() => setMerchantStatus('风控审核完成', '审核通过', '审核流转至风控审核完成')}>审核通过</Button>,
        <Button key="reject" danger>拒绝签约</Button>
      ];
    }
    return [];
  }, [data.id, data.merchantStatus, data.riskCheckStage, blocked, navigate]);

  const actionsForEntity = (status: EntityStatus) => ['待审核', '待风控审核'].includes(status) ? ['查看详情', '审核'] : ['查看详情'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>商户审核详情</Typography.Title>
        <Typography.Text type="secondary">MID 审核主处理页</Typography.Text>
      </div>

      <Card id="overview">
        <Descriptions column={3} bordered size="small" items={Object.entries(data.overview).map(([k, v]) => ({ key: k, label: k, children: k === '商户审核状态' ? reviewTag(data.merchantStatus) : v || '-' }))} />
      </Card>

      <Card>
        <Space wrap>{topActions}</Space>
      </Card>

      {blocked && <Alert type="warning" showIcon message={blockMsg} />}

      <div className="detail-section-nav-wrap">
        <div className="detail-section-nav">
          {navItems.map(([k, t]) => (
            <button key={k} type="button" className={`detail-section-nav-item ${active === k ? 'active' : ''}`} onClick={() => document.getElementById(k)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{t}</button>
          ))}
        </div>
      </div>

      <Card id="keys" title="主键与关联信息区"><Descriptions bordered column={3} size="small" items={Object.entries(data.sections.keys).map(([k, v]) => ({ key: k, label: k, children: ['MID', 'CID', 'SID'].includes(k) ? <Typography.Text copyable>{v}</Typography.Text> : v }))} /></Card>

      <Card id="flow" title="审核流转信息区"><Descriptions bordered column={3} size="small" items={Object.entries(data.sections.flow).map(([k, v]) => ({ key: k, label: k, children: k === '商户审核状态' ? reviewTag(data.merchantStatus) : v || '-' }))} /></Card>

      <Card id="enterprise" title="企业审核信息区" extra={<Space>{actionsForEntity(data.enterprise.status).includes('查看详情') && <Button type="link" onClick={() => window.open(`/enterprises/${data.overview.CID}`, '_blank')}>查看详情</Button>}{actionsForEntity(data.enterprise.status).includes('审核') && <Button type="link" onClick={() => setEnterpriseDrawer(true)}>审核</Button>}</Space>}>
        <Descriptions bordered column={3} size="small" items={Object.entries(data.enterprise.summary).map(([k, v]) => ({ key: k, label: k, children: v || '-' }))} />
      </Card>

      <Card id="shop" title="商铺审核信息区" extra={<Space>{actionsForEntity(data.shop.status).includes('查看详情') && <Button type="link" onClick={() => window.open(`/shops/${data.overview.SID}`, '_blank')}>查看详情</Button>}{actionsForEntity(data.shop.status).includes('审核') && <Button type="link" onClick={() => setShopDrawer(true)}>审核</Button>}</Space>}>
        <Descriptions bordered column={3} size="small" items={Object.entries(data.shop.summary).map(([k, v]) => ({ key: k, label: k, children: v || '-' }))} />
      </Card>

      <Card id="channelAfp" title="渠道与 AFP Store 信息区"><Descriptions bordered column={3} size="small" items={Object.entries(data.sections.channelAfp).map(([k, v]) => ({ key: k, label: k, children: k.includes('状态') ? <Tag color="processing">{v}</Tag> : v || '-' }))} /></Card>
      <Card id="settlement" title="结算与银行信息区"><Descriptions bordered column={3} size="small" items={Object.entries(data.sections.settlement).map(([k, v]) => ({ key: k, label: k, children: v || '-' }))} /></Card>
      <Card id="product" title="产品与支付方式信息区"><Descriptions bordered column={3} size="small" items={Object.entries(data.sections.product).map(([k, v]) => ({ key: k, label: k, children: v || '-' }))} /></Card>
      <Card id="baPm" title="BA / Transfer Instrument / PM 信息区"><Descriptions bordered column={3} size="small" items={Object.entries(data.sections.baPm).map(([k, v]) => ({ key: k, label: k, children: v || '-' }))} /></Card>
      <Card id="specialRate" title="特殊费率申请信息区"><Descriptions bordered column={3} size="small" items={Object.entries(data.sections.specialRate).map(([k, v]) => ({ key: k, label: k, children: v || '-' }))} /></Card>

      <Card id="timeline" title="修改记录时间轴区">
        <Timeline items={data.timeline.map((t) => ({ children: `${t.time} | ${t.operator} | ${t.target} | ${t.action} | ${t.summary} | ${t.remark}` }))} />
      </Card>

      <Drawer open={enterpriseDrawer} onClose={() => setEnterpriseDrawer(false)} title="企业审核" width={560} footer={<Space><Button onClick={() => enterpriseAudit(false)}>审核驳回</Button><Button type="primary" onClick={() => enterpriseAudit(true)}>审核通过</Button></Space>}>
        <Descriptions column={1} bordered items={[{ key: 'name', label: '企业', children: data.enterprise.summary['企业主显示名称'] }, { key: 'status', label: '当前状态', children: data.enterprise.status }, { key: 'reviewer', label: '当前审核人', children: data.enterprise.reviewer }]} />
      </Drawer>

      <Drawer open={shopDrawer} onClose={() => setShopDrawer(false)} title="商铺审核" width={560} footer={<Space><Button onClick={() => shopAudit(false)}>审核驳回</Button><Button type="primary" onClick={() => shopAudit(true)}>审核通过</Button></Space>}>
        <Descriptions column={1} bordered items={[{ key: 'name', label: '商铺', children: data.shop.summary['商铺主显示名称'] }, { key: 'status', label: '当前状态', children: data.shop.status }, { key: 'reviewer', label: '当前审核人', children: data.shop.reviewer }]} />
      </Drawer>

      <ModalTransfer open={transferOpen} onClose={() => setTransferOpen(false)} onSubmit={(person) => { appendTimeline('转交审核', `已转交给 ${person}`); setTransferOpen(false); message.success('已转交审核（demo模拟）'); }} />

      <Divider />
    </div>
  );
};

const ModalTransfer = ({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (person: string) => void }) => {
  const [person, setPerson] = useState('');
  return (
    <Drawer open={open} onClose={onClose} title="转交审核" width={420} footer={<Space><Button onClick={onClose}>关闭</Button><Button type="primary" onClick={() => onSubmit(person || '审核员A')}>确认</Button></Space>}>
      <Form layout="vertical">
        <Form.Item label="选择审核人"><Select value={person} onChange={setPerson} options={[{ value: '审核员A' }, { value: '审核员B' }, { value: '审核员C' }]} /></Form.Item>
        <Form.Item label="备注"><Input.TextArea rows={4} /></Form.Item>
      </Form>
    </Drawer>
  );
};
