import { Alert, Button, Card, Descriptions, Drawer, Input, Modal, Select, Space, Tag, Timeline, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ProductRateTable, buildRateRows, type ProductRateRow } from '../components/ProductRateTable';
import type { MerchantSignedStatus } from './MerchantStatusListPage';

type MerchantStatus =
  | '待审核'
  | '基础资料审核'
  | '销售主管审核'
  | '风控核查（1）'
  | '风控核查（2）'
  | '风控初级审核'
  | '风控中级审核'
  | '总经理审核'
  | '风控审核完成'
  | MerchantSignedStatus;
type EntityStatus = '待审核' | '待风控审核' | '审核通过' | '审核不通过';
type RiskLevel = '低' | '中' | '高';

interface DetailRecord {
  id: string;
  overview: Record<string, string>;
  merchantStatus: MerchantStatus;
  channels: string[];
  currentReviewer: string;
  riskLevel: RiskLevel;
  riskScoreDone: boolean;
  basicAssessmentDone: boolean;
  enterprise: { summary: Record<string, string>; status: EntityStatus; reviewer: string };
  shop: { summary: Record<string, string>; status: EntityStatus; reviewer: string };
  settlement: Record<string, string>;
  timeline: Array<{ time: string; operator: string; target: string; action: string; summary: string; remark: string }>;
}

const baseSeed: DetailRecord = {
  id: 'm-2',
  merchantStatus: '基础资料审核',
  channels: ['Adyen_AFP'],
  currentReviewer: 'OPS-Ryan',
  riskLevel: '中',
  riskScoreDone: false,
  basicAssessmentDone: false,
  overview: {
    MID: 'MID-002',
    CID: 'CID-101',
    SID: 'SID-10002',
    渠道编码: 'ADY_AFP',
    服务编码: 'POS_CORE',
    进件通道: 'Adyen_AFP',
    商户审核状态: '基础资料审核',
    当前审核人: 'OPS-Ryan',
    风险等级: '中',
    上單來源: 'DMO',
    创建时间: '2026-04-02 12:00:00',
    更新时间: '2026-04-03 15:00:00'
  },
  enterprise: {
    status: '待风控审核',
    reviewer: 'Risk-Team-A',
    summary: { 企业主显示名称: 'HK Food Group', CID: 'CID-101', 企业启用状态: '-', 企业审核状态: '待风控审核', 公司模式: '连锁', 法律地位: '有限公司', 行业分类: '餐饮' }
  },
  shop: {
    status: '待风控审核',
    reviewer: 'Risk-Team-B',
    summary: { 商铺主显示名称: '旺角站前店', SID: 'SID-10002', 所属企业名称: 'HK Food Group', 商铺启用状态: '-', 商铺审核状态: '待风控审核', 商铺类型: '线下门店', 经营模式: '直营' }
  },
  settlement: { 結算週期: 'D+1', 結算幣種: 'HKD', 打款銀行: 'DBS', FPS賬號: 'FPS-9002', 收款銀行賬戶名稱: 'HK Food Group Ltd' },
  timeline: [{ time: '2026-04-03 15:00:00', operator: 'OPS-Ryan', target: '商户', action: '进入基础资料审核', summary: '开始核查并接手审核', remark: '-' }]
};

const statusById: Record<string, { status: MerchantStatus; reviewer: string; riskLevel?: RiskLevel }> = {
  'm-1': { status: '待审核', reviewer: '-' },
  'm-2': { status: '基础资料审核', reviewer: 'OPS-Ryan' },
  'm-3': { status: '销售主管审核', reviewer: 'System' },
  'm-4': { status: '风控核查（1）', reviewer: '-' },
  'm-5': { status: '风控核查（2）', reviewer: 'Risk-Ken' },
  'm-6': { status: '风控初级审核', reviewer: 'Risk-Junior', riskLevel: '低' },
  'm-7': { status: '风控中级审核', reviewer: 'Risk-Senior', riskLevel: '中' },
  'm-8': { status: '总经理审核', reviewer: 'GM-Anna', riskLevel: '高' },
  'm-9': { status: '风控审核完成', reviewer: 'System', riskLevel: '低' }
};

const reviewerPool: Record<string, string[]> = {
  OPS: ['OPS-Ryan', 'OPS-Lily', 'OPS-Jen'],
  风控核查: ['Risk-Ken', 'Risk-Iris', 'Risk-Mike'],
  风控初审: ['Risk-Junior', 'Risk-Jason'],
  风控中审: ['Risk-Senior', 'Risk-Alice'],
  总经理: ['GM-Anna', 'GM-John']
};

const navItems = [
  ['overview', '概览'],
  ['keys', '主键与关联信息'],
  ['enterprise', '企业审核信息'],
  ['shop', '商铺审核信息'],
  ['settlement', '结算与银行信息'],
  ['productRate', '产品费率'],
  ['timeline', '修改记录时间轴']
] as const;

const nowText = () => new Date().toLocaleString('sv-SE').replace('T', ' ');

const buildInitialById = (id: string) => {
  const preset = statusById[id] ?? statusById['m-2'];
  return {
    ...baseSeed,
    id,
    merchantStatus: preset.status,
    currentReviewer: preset.reviewer,
    riskLevel: preset.riskLevel ?? baseSeed.riskLevel,
    riskScoreDone: preset.status !== '风控核查（2）',
    basicAssessmentDone: preset.status !== '风控核查（2）',
    overview: {
      ...baseSeed.overview,
      MID: `MID-${id.replace('m-', '').padStart(3, '0')}`,
      商户审核状态: preset.status,
      当前审核人: preset.reviewer,
      风险等级: preset.riskLevel ?? baseSeed.riskLevel,
      更新时间: nowText()
    }
  };
};

export const MerchantReviewDetailPage = () => {
  const { id = 'm-2' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<DetailRecord>(() => buildInitialById(id));
  const [rates] = useState<ProductRateRow[]>(buildRateRows());
  const [active, setActive] = useState('overview');
  const [enterpriseDrawer, setEnterpriseDrawer] = useState(false);
  const [shopDrawer, setShopDrawer] = useState(false);

  const pushTimeline = (action: string, summary: string, operator = '当前登录用户') => {
    setData((prev) => ({
      ...prev,
      timeline: [{ time: nowText(), operator, target: '商户', action, summary, remark: '-' }, ...prev.timeline]
    }));
  };

  const updateStatus = (status: MerchantStatus, summary: string, reviewer = data.currentReviewer, operator = '当前登录用户') => {
    setData((prev) => ({
      ...prev,
      merchantStatus: status,
      currentReviewer: reviewer,
      overview: { ...prev.overview, 商户审核状态: status, 当前审核人: reviewer, 更新时间: nowText() },
      timeline: [{ time: nowText(), operator, target: '商户', action: `状态流转至${status}`, summary, remark: '-' }, ...prev.timeline]
    }));
  };

  useEffect(() => {
    const stateStatus = (location.state as { merchantStatus?: MerchantStatus } | null)?.merchantStatus;
    if (stateStatus && ['已签约', '取消签约', '拒绝签约'].includes(stateStatus)) {
      setData((prev) => ({
        ...prev,
        id,
        merchantStatus: stateStatus,
        currentReviewer: stateStatus === '已签约' ? 'System' : 'OPS-Ryan',
        overview: {
          ...prev.overview,
          MID: `MID-${id.replace('m-', '').padStart(3, '0')}`,
          商户审核状态: stateStatus,
          当前审核人: stateStatus === '已签约' ? 'System' : 'OPS-Ryan',
          更新时间: nowText()
        },
        enterprise: {
          ...prev.enterprise,
          status: '审核通过',
          summary: {
            ...prev.enterprise.summary,
            企业启用状态: stateStatus === '取消签约' || stateStatus === '拒绝签约' ? '停用' : '启用',
            企业审核状态: '审核通过'
          }
        },
        shop: {
          ...prev.shop,
          status: '审核通过',
          summary: {
            ...prev.shop.summary,
            商铺启用状态: stateStatus === '取消签约' || stateStatus === '拒绝签约' ? '停用' : '启用',
            商铺审核状态: '审核通过'
          }
        }
      }));
      return;
    }
    setData(buildInitialById(id));
  }, [id, location.state]);

  useEffect(() => {
    const nodes = navItems.map(([k]) => document.getElementById(k)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const cur = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (cur?.target?.id) setActive(cur.target.id);
      },
      { rootMargin: '-170px 0px -65% 0px', threshold: [0.1, 0.3, 0.6] }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [data.id]);

  const handleTransferReview = () => {
    let selected = '';
    const options =
      data.merchantStatus === '基础资料审核'
        ? reviewerPool.OPS
        : data.merchantStatus === '风控核查（2）'
          ? reviewerPool.风控核查
          : data.merchantStatus === '风控初级审核'
            ? reviewerPool.风控初审
            : data.merchantStatus === '风控中级审核'
              ? reviewerPool.风控中审
              : reviewerPool.总经理;
    Modal.confirm({
      title: '转交审核',
      content: <Select style={{ width: '100%' }} placeholder="请选择新的审核人" options={options.map((name) => ({ value: name }))} onChange={(v) => { selected = v; }} />,
      onOk: () => {
        if (!selected) {
          message.warning('请先选择审核人');
          return Promise.reject(new Error('reviewer required'));
        }
        setData((prev) => ({
          ...prev,
          currentReviewer: selected,
          overview: { ...prev.overview, 当前审核人: selected, 更新时间: nowText() },
          timeline: [{ time: nowText(), operator: '当前登录用户', target: '商户', action: '转交审核', summary: `转交给 ${selected}`, remark: '-' }, ...prev.timeline]
        }));
        message.success('已转交审核人（demo 模拟）');
        return Promise.resolve();
      }
    });
  };

  const handleApproveByRisk = () => {
    if (data.merchantStatus === '风控初级审核') {
      if (data.riskLevel === '低') updateStatus('风控审核完成', '风控初级审核通过，低风险直接完成', 'System', 'Risk-Junior');
      else updateStatus('风控中级审核', '风控初级审核通过，流转至风控中级审核', 'Risk-Senior', 'Risk-Junior');
      return;
    }
    if (data.merchantStatus === '风控中级审核') {
      if (data.riskLevel === '高') updateStatus('总经理审核', '风控中级审核通过，高风险流转总经理审核', 'GM-Anna', 'Risk-Senior');
      else updateStatus('风控审核完成', '风控中级审核通过，完成风控审核', 'System', 'Risk-Senior');
      return;
    }
    if (data.merchantStatus === '总经理审核') {
      updateStatus('风控审核完成', '总经理审核通过，完成风控审核', 'System', 'GM-Anna');
    }
  };

  const topActions = useMemo(() => {
    if (data.merchantStatus === '待审核') {
      return [
        <Button key="start" type="primary" onClick={() => updateStatus('基础资料审核', 'OPS 点击开始核查', '当前登录用户', '当前登录用户')}>开始核查</Button>
      ];
    }

    if (data.merchantStatus === '基础资料审核') {
      return [
        <Button key="edit" onClick={() => navigate(`/merchants/${id}/edit`)}>编辑</Button>,
        <Button key="cancel" danger onClick={() => updateStatus('取消签约', '基础资料审核阶段取消签约', '当前登录用户')}>取消簽約</Button>,
        <Button
          key="copy"
          onClick={() => {
            let source = '';
            Modal.confirm({
              title: '從已有商戶複製資料',
              content: <Select style={{ width: '100%' }} placeholder="请选择来源商户" options={[{ value: 'MID-001' }, { value: 'MID-006' }, { value: 'MID-008' }]} onChange={(v) => { source = v; }} />,
              onOk: () => {
                if (!source) {
                  message.warning('请选择来源商户');
                  return Promise.reject(new Error('source required'));
                }
                pushTimeline('从已有商户复制资料', `复制来源：${source}`);
                message.success('已复制商户资料（demo 模拟）');
                return Promise.resolve();
              }
            });
          }}
        >
          從已有商戶複製資料
        </Button>,
        <Button key="transfer" onClick={handleTransferReview}>轉交審核</Button>,
        <Button key="submit" type="primary" onClick={() => updateStatus('风控核查（1）', '基础资料审核递交，系统进入风控核查（1）', '-', 'System')}>遞交審核</Button>
      ];
    }

    if (data.merchantStatus === '风控核查（1）') {
      return [
        <Button key="start-risk" type="primary" onClick={() => updateStatus('风控核查（2）', '风控人员开始核查并接手', '当前登录用户')}>开始核查</Button>
      ];
    }

    if (data.merchantStatus === '风控核查（2）') {
      return [
        <Button key="edit" onClick={() => navigate(`/merchants/${id}/edit`)}>编辑</Button>,
        <Button key="notify" onClick={() => { pushTimeline('通知BD（OS补件）', '数据推送到风控 OS'); message.success('已通知BD（OS补件）'); }}>通知BD（OS补件）</Button>,
        <Button key="cancel" danger onClick={() => updateStatus('取消签约', '风控核查阶段取消签约')}>取消签约</Button>,
        <Button
          key="risk-score"
          onClick={() => {
            let level = data.riskLevel;
            Modal.confirm({
              title: '风险评分风控核查',
              content: <Select style={{ width: '100%' }} value={level} options={[{ value: '低' }, { value: '中' }, { value: '高' }]} onChange={(v: RiskLevel) => { level = v; }} />,
              onOk: () => {
                setData((prev) => ({
                  ...prev,
                  riskLevel: level,
                  riskScoreDone: true,
                  overview: { ...prev.overview, 风险等级: level, 更新时间: nowText() },
                  timeline: [{ time: nowText(), operator: 'Risk-Ken', target: '商户', action: '风险评分风控核查', summary: `风险等级更新为 ${level}`, remark: '-' }, ...prev.timeline]
                }));
                message.success('风险评分已完成');
                return Promise.resolve();
              }
            });
          }}
        >
          风险评分风控核查
        </Button>,
        <Button key="rollback" onClick={() => updateStatus('风控核查（1）', '退回至风控核查（1）', '-', 'Risk-Ken')}>退回审核</Button>,
        <Button key="transfer" onClick={handleTransferReview}>转交审核</Button>,
        <Button
          key="submit-risk"
          type="primary"
          onClick={() => {
            if (!data.riskScoreDone || !data.basicAssessmentDone) {
              message.warning('需先完成风险评分风控核查与基础资料评定后，方可递交风控');
              return;
            }
            updateStatus('风控初级审核', '风控核查（2）递交至风控初级审核', 'Risk-Junior', 'Risk-Ken');
          }}
        >
          递交风控
        </Button>,
        <Button
          key="base-rate"
          onClick={() => {
            let comment = '';
            Modal.confirm({
              title: '基础资料评定',
              content: <Input.TextArea rows={4} placeholder="请输入基础资料评定结论" onChange={(e) => { comment = e.target.value; }} />,
              onOk: () => {
                setData((prev) => ({
                  ...prev,
                  basicAssessmentDone: true,
                  overview: { ...prev.overview, 更新时间: nowText() },
                  timeline: [{ time: nowText(), operator: 'Risk-Ken', target: '商户', action: '基础资料评定', summary: comment || '完成基础资料评定', remark: '-' }, ...prev.timeline]
                }));
                message.success('基础资料评定已完成');
                return Promise.resolve();
              }
            });
          }}
        >
          基础资料评定
        </Button>
      ];
    }

    if (data.merchantStatus === '风控初级审核' || data.merchantStatus === '风控中级审核' || data.merchantStatus === '总经理审核') {
      return [
        <Button key="notify" onClick={() => { pushTimeline('通知BD（OS补件）', '数据推送到风控 OS'); message.success('已通知BD（OS补件）'); }}>通知BD（OS补件）</Button>,
        <Button key="cancel" danger onClick={() => updateStatus('取消签约', `${data.merchantStatus}阶段取消签约`)}>取消签约</Button>,
        <Button key="rollback" onClick={() => updateStatus('风控核查（1）', `${data.merchantStatus}退回审核至风控核查（1）`, '-', data.currentReviewer)}>退回审核</Button>,
        <Button key="transfer" onClick={handleTransferReview}>转交审核</Button>,
        <Button key="pass" type="primary" onClick={handleApproveByRisk}>审核通过</Button>,
        <Button key="reject" danger onClick={() => updateStatus('拒绝签约', `${data.merchantStatus}拒绝签约`, data.currentReviewer)}>拒绝签约</Button>
      ];
    }

    return [];
  }, [data, id, navigate]);

  const showRiskCheckHint = data.merchantStatus === '风控核查（2）' && (!data.riskScoreDone || !data.basicAssessmentDone);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <Card
        id="overview"
      >
        <Descriptions
          column={3}
          bordered
          size="small"
          items={Object.entries(data.overview).map(([k, v]) => ({ key: k, label: k, children: k === '商户审核状态' ? <Tag color="default">{data.merchantStatus}</Tag> : v || '-' }))}
        />
      </Card>
      <Card><Space wrap>{topActions}</Space></Card>
      {showRiskCheckHint && <Alert type="warning" showIcon message="当前处于风控核查（2）：需完成【风险评分风控核查】和【基础资料评定】后才能递交风控。" />}

      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{navItems.map(([k, t]) => <button key={k} type="button" className={`detail-section-nav-item ${active === k ? 'active' : ''}`} onClick={() => document.getElementById(k)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{t}</button>)}</div></div>

      <Card id="keys" title="主键与关联信息区"><Descriptions bordered column={3} size="small" items={Object.entries(data.overview).filter(([k]) => ['MID', 'CID', 'SID', '渠道编码', '服务编码', '进件通道', '风险等级'].includes(k)).map(([k, v]) => ({ key: k, label: k, children: v }))} /></Card>
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
