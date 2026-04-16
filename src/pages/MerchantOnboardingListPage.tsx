import { Badge, Button, Card, Col, Collapse, Form, Input, Modal, Popover, Row, Select, Space, Table, Tag, Timeline, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';

type OnboardingStatus = '待遞交' | '處理中' | '進件失敗' | '待风控审核' | '待重新進件' | '進件成功';
type ProgressStatus = '未开始' | '处理中' | '部分成功' | '全部成功' | '失败';
type AttemptResult = '成功' | '失败' | '处理中';
type SourceType = '首次进件' | 'OPS修改后重进件' | '风控通过后重进件';

type SnapshotField = {
  group: string;
  systemField: string;
  afpField: string;
  value: string;
  changed?: boolean;
  beforeValue?: string;
  afterValue?: string;
};

type ApiExecution = {
  order: number;
  api: string;
  result: AttemptResult;
  code: string;
  message: string;
  updatedAt: string;
};

type HistoryAttempt = {
  id: string;
  attemptNo: number;
  submitTime: string;
  operator: string;
  modifyTime: string;
  channel: string;
  source: SourceType;
  onboardingStatus: OnboardingStatus;
  progress: ProgressStatus;
  result: AttemptResult;
  errorSummary: string;
  snapshot: SnapshotField[];
  apiExecutions: ApiExecution[];
};

type OnboardingRecord = {
  id: string;
  merchantName: string;
  mid: string;
  channels: string[];
  channelMerchantNo: string;
  channelAvailable: '可用' | '不可用';
  progress: ProgressStatus;
  onboardingStatus: OnboardingStatus;
  latestErrorSummary: string;
  returnMessages: Array<{ api: string; summary: string }>;
  updatedAt: string;
  history: HistoryAttempt[];
};

const requiredApis = [
  'POST /legalEntities',
  'PATCH /legalEntities/{id}',
  'POST /accountHolders',
  'GET /accountHolders/{id}',
  'POST /balanceAccounts',
  'POST /businessLines',
  'POST /merchants/{merchantId}/stores',
  'POST /merchants/{merchantId}/paymentMethodSettings',
  'GET /merchants/{merchantId}/paymentMethodSettings',
  'webhook：balancePlatform.accountHolder.updated',
  'webhook：paymentMethod.created'
];

const statusColorMap: Record<OnboardingStatus, string> = {
  待遞交: 'default',
  處理中: 'processing',
  進件失敗: 'error',
  待风控审核: 'warning',
  待重新進件: 'purple',
  進件成功: 'success'
};

const progressColorMap: Record<ProgressStatus, string> = {
  未开始: 'default',
  处理中: 'processing',
  部分成功: 'warning',
  全部成功: 'success',
  失败: 'error'
};

const seedData: OnboardingRecord[] = [
  {
    id: 'ob-1',
    merchantName: 'HK Food Group - 旺角站前店',
    mid: 'MID-002',
    channels: ['Adyen_AFP'],
    channelMerchantNo: 'ADY-M-90012',
    channelAvailable: '可用',
    progress: '全部成功',
    onboardingStatus: '進件成功',
    latestErrorSummary: '-',
    returnMessages: [{ api: 'paymentMethodSettings', summary: 'all enabled' }],
    updatedAt: '2026-04-15 10:35:00',
    history: [
      {
        id: 'h-1-2',
        attemptNo: 2,
        submitTime: '2026-04-15 10:30:00',
        operator: 'OPS-Lily',
        modifyTime: '2026-04-15 10:25:00',
        channel: 'Adyen_AFP',
        source: 'OPS修改后重进件',
        onboardingStatus: '進件成功',
        progress: '全部成功',
        result: '成功',
        errorSummary: '-',
        snapshot: [
          { group: '企业信息', systemField: '企业主显示名称', afpField: 'legalEntities.name', value: 'HK Food Group' },
          { group: '商铺信息', systemField: '商铺主显示名称', afpField: 'stores.description', value: '旺角站前店' },
          { group: '商户信息', systemField: '渠道编码', afpField: 'paymentMethodSettings.profileId', value: 'ADY_AFP_PROFILE' },
          { group: 'Payment Method 相关', systemField: '结算币种', afpField: 'paymentMethodSettings.currency', value: 'HKD', changed: true, beforeValue: 'USD', afterValue: 'HKD' }
        ],
        apiExecutions: requiredApis.map((api, idx) => ({ order: idx + 1, api, result: '成功', code: '200', message: 'ok', updatedAt: '2026-04-15 10:30:10' }))
      },
      {
        id: 'h-1-1',
        attemptNo: 1,
        submitTime: '2026-04-14 16:10:00',
        operator: 'OPS-Lily',
        modifyTime: '2026-04-14 16:10:00',
        channel: 'Adyen_AFP',
        source: '首次进件',
        onboardingStatus: '進件失敗',
        progress: '部分成功',
        result: '失败',
        errorSummary: 'paymentMethodSettings.currency invalid',
        snapshot: [
          { group: '企业信息', systemField: '企业主显示名称', afpField: 'legalEntities.name', value: 'HK Food Group' },
          { group: '商铺信息', systemField: '商铺主显示名称', afpField: 'stores.description', value: '旺角站前店' },
          { group: 'Payment Method 相关', systemField: '结算币种', afpField: 'paymentMethodSettings.currency', value: 'USD' }
        ],
        apiExecutions: requiredApis.map((api, idx) => ({
          order: idx + 1,
          api,
          result: api.includes('paymentMethodSettings') ? '失败' : '成功',
          code: api.includes('paymentMethodSettings') ? '422' : '200',
          message: api.includes('paymentMethodSettings') ? 'currency not allowed' : 'ok',
          updatedAt: '2026-04-14 16:10:20'
        }))
      }
    ]
  },
  {
    id: 'ob-2',
    merchantName: 'Cross Channel Retail',
    mid: 'MID-009',
    channels: ['Adyen_AFP', 'OtherGateway'],
    channelMerchantNo: 'ADY-M-90188',
    channelAvailable: '不可用',
    progress: '失败',
    onboardingStatus: '進件失敗',
    latestErrorSummary: 'stores.address line1 required',
    returnMessages: [{ api: 'stores', summary: 'line1 required' }, { api: 'businessLines', summary: 'ok' }],
    updatedAt: '2026-04-15 09:00:00',
    history: [
      {
        id: 'h-2-1',
        attemptNo: 1,
        submitTime: '2026-04-15 09:00:00',
        operator: 'OPS-Ryan',
        modifyTime: '2026-04-15 08:58:00',
        channel: 'Adyen_AFP,OtherGateway',
        source: '首次进件',
        onboardingStatus: '進件失敗',
        progress: '失败',
        result: '失败',
        errorSummary: 'stores.address line1 required',
        snapshot: [
          { group: '企业信息', systemField: '企业主显示名称', afpField: 'legalEntities.name', value: 'Cross Channel Retail' },
          { group: '商铺信息', systemField: '商铺地址', afpField: 'stores.address.line1', value: '' },
          { group: '商户信息', systemField: '上單來源', afpField: 'meta.source', value: 'DMO' },
          { group: 'Account Holder / Balance Account 相关', systemField: '收款銀行賬戶名稱', afpField: 'accountHolders.legalEntityName', value: 'Cross Channel Retail Ltd' },
          { group: 'Business Line / Store 相关', systemField: 'Store参考号', afpField: 'stores.reference', value: 'STORE-0901' },
          { group: 'Payment Method 相关', systemField: '交易费率', afpField: 'paymentMethodSettings.pricing.rate', value: '2.5' }
        ],
        apiExecutions: requiredApis.map((api, idx) => ({
          order: idx + 1,
          api,
          result: api.includes('stores') ? '失败' : api.includes('paymentMethodSettings') ? '处理中' : '成功',
          code: api.includes('stores') ? '422' : api.includes('paymentMethodSettings') ? '102' : '200',
          message: api.includes('stores') ? 'line1 required' : api.includes('paymentMethodSettings') ? 'processing' : 'ok',
          updatedAt: '2026-04-15 09:00:30'
        }))
      }
    ]
  },
  {
    id: 'ob-3',
    merchantName: 'AFP Processing Demo',
    mid: 'MID-010',
    channels: ['Adyen_AFP'],
    channelMerchantNo: 'ADY-M-90220',
    channelAvailable: '不可用',
    progress: '处理中',
    onboardingStatus: '處理中',
    latestErrorSummary: '-',
    returnMessages: [{ api: 'accountHolders', summary: 'processing' }],
    updatedAt: '2026-04-16 11:10:00',
    history: [
      {
        id: 'h-3-1',
        attemptNo: 1,
        submitTime: '2026-04-16 11:10:00',
        operator: 'OPS-Mike',
        modifyTime: '2026-04-16 11:05:00',
        channel: 'Adyen_AFP',
        source: '首次进件',
        onboardingStatus: '處理中',
        progress: '处理中',
        result: '处理中',
        errorSummary: '-',
        snapshot: [
          { group: '企业信息', systemField: '企业主显示名称', afpField: 'legalEntities.name', value: 'AFP Processing Demo' },
          { group: '商铺信息', systemField: '商铺主显示名称', afpField: 'stores.description', value: 'Processing Store' },
          { group: '其他补充字段', systemField: '通道商户号', afpField: 'merchants.id', value: 'ADY-M-90220' }
        ],
        apiExecutions: requiredApis.map((api, idx) => ({ order: idx + 1, api, result: idx < 4 ? '成功' : '处理中', code: idx < 4 ? '200' : '102', message: idx < 4 ? 'ok' : 'processing', updatedAt: '2026-04-16 11:10:30' }))
      }
    ]
  },
  {
    id: 'ob-4',
    merchantName: 'Mixed Channel Pending Risk',
    mid: 'MID-011',
    channels: ['Adyen_AFP', 'LegacyGateway'],
    channelMerchantNo: 'ADY-M-90301',
    channelAvailable: '不可用',
    progress: '未开始',
    onboardingStatus: '待风控审核',
    latestErrorSummary: '等待风控审核后重新进件',
    returnMessages: [{ api: 'risk-gate', summary: 'pending risk review' }],
    updatedAt: '2026-04-16 09:20:00',
    history: [
      {
        id: 'h-4-2',
        attemptNo: 2,
        submitTime: '2026-04-16 09:20:00',
        operator: 'OPS-Anna',
        modifyTime: '2026-04-16 09:18:00',
        channel: 'Adyen_AFP,LegacyGateway',
        source: 'OPS修改后重进件',
        onboardingStatus: '待风控审核',
        progress: '未开始',
        result: '处理中',
        errorSummary: '进入待风控审核队列',
        snapshot: [
          { group: '商铺信息', systemField: '商铺地址', afpField: 'stores.address.line1', value: '1 Queen\'s Rd', changed: true, beforeValue: '', afterValue: '1 Queen\'s Rd' },
          { group: '商户信息', systemField: '上單來源', afpField: 'meta.source', value: 'CRM', changed: true, beforeValue: 'DMO', afterValue: 'CRM' }
        ],
        apiExecutions: requiredApis.map((api, idx) => ({ order: idx + 1, api, result: '处理中', code: '102', message: 'queued by risk gate', updatedAt: '2026-04-16 09:20:20' }))
      },
      {
        id: 'h-4-1',
        attemptNo: 1,
        submitTime: '2026-04-15 18:00:00',
        operator: 'OPS-Anna',
        modifyTime: '2026-04-15 17:50:00',
        channel: 'Adyen_AFP,LegacyGateway',
        source: '首次进件',
        onboardingStatus: '進件失敗',
        progress: '失败',
        result: '失败',
        errorSummary: 'stores.address line1 required',
        snapshot: [
          { group: '商铺信息', systemField: '商铺地址', afpField: 'stores.address.line1', value: '' }
        ],
        apiExecutions: requiredApis.map((api, idx) => ({ order: idx + 1, api, result: api.includes('stores') ? '失败' : '成功', code: api.includes('stores') ? '422' : '200', message: api.includes('stores') ? 'line1 required' : 'ok', updatedAt: '2026-04-15 18:00:30' }))
      }
    ]
  },
  {
    id: 'ob-5',
    merchantName: 'Mixed Channel After Risk Pass',
    mid: 'MID-012',
    channels: ['Adyen_AFP', 'LegacyGateway'],
    channelMerchantNo: 'ADY-M-90366',
    channelAvailable: '不可用',
    progress: '处理中',
    onboardingStatus: '處理中',
    latestErrorSummary: '-',
    returnMessages: [{ api: 'risk-gate', summary: 'risk approved, resend started' }],
    updatedAt: '2026-04-16 12:12:00',
    history: [
      {
        id: 'h-5-3',
        attemptNo: 3,
        submitTime: '2026-04-16 12:10:00',
        operator: 'Risk-Linda',
        modifyTime: '2026-04-16 12:08:00',
        channel: 'Adyen_AFP,LegacyGateway',
        source: '风控通过后重进件',
        onboardingStatus: '處理中',
        progress: '处理中',
        result: '处理中',
        errorSummary: '-',
        snapshot: [
          { group: '商户信息', systemField: '风控结论', afpField: 'meta.riskDecision', value: 'pass' }
        ],
        apiExecutions: requiredApis.map((api, idx) => ({ order: idx + 1, api, result: idx < 6 ? '成功' : '处理中', code: idx < 6 ? '200' : '102', message: idx < 6 ? 'ok' : 'processing', updatedAt: '2026-04-16 12:10:20' }))
      },
      {
        id: 'h-5-2',
        attemptNo: 2,
        submitTime: '2026-04-16 09:40:00',
        operator: 'OPS-Tom',
        modifyTime: '2026-04-16 09:35:00',
        channel: 'Adyen_AFP,LegacyGateway',
        source: 'OPS修改后重进件',
        onboardingStatus: '待风控审核',
        progress: '未开始',
        result: '处理中',
        errorSummary: '待风控审核',
        snapshot: [
          { group: '商铺信息', systemField: '商铺地址', afpField: 'stores.address.line1', value: '8 Harbour Rd', changed: true, beforeValue: '', afterValue: '8 Harbour Rd' }
        ],
        apiExecutions: requiredApis.map((api, idx) => ({ order: idx + 1, api, result: '处理中', code: '102', message: 'queued', updatedAt: '2026-04-16 09:40:30' }))
      },
      {
        id: 'h-5-1',
        attemptNo: 1,
        submitTime: '2026-04-15 20:10:00',
        operator: 'OPS-Tom',
        modifyTime: '2026-04-15 20:05:00',
        channel: 'Adyen_AFP,LegacyGateway',
        source: '首次进件',
        onboardingStatus: '進件失敗',
        progress: '失败',
        result: '失败',
        errorSummary: 'stores.address line1 required',
        snapshot: [{ group: '商铺信息', systemField: '商铺地址', afpField: 'stores.address.line1', value: '' }],
        apiExecutions: requiredApis.map((api, idx) => ({ order: idx + 1, api, result: api.includes('stores') ? '失败' : '成功', code: api.includes('stores') ? '422' : '200', message: api.includes('stores') ? 'line1 required' : 'ok', updatedAt: '2026-04-15 20:10:50' }))
      }
    ]
  }
];

const coreFilterFields = ['商户名称', '商户号（MID）', '通道', '进件单状态', '通道进件进度', '更新时间'];

export const MerchantOnboardingListPage = () => {
  const [records, setRecords] = useState<OnboardingRecord[]>(seedData);
  const [expandedFilter, setExpandedFilter] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<OnboardingRecord | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>();
  const [editForm] = Form.useForm();

  const filterFields = useMemo(() => [
    { label: '商户名称', node: <Input placeholder="输入商户名称" /> },
    { label: '商户号（MID）', node: <Input placeholder="输入 MID" /> },
    { label: '通道', node: <Select mode="multiple" options={[{ value: 'Adyen_AFP' }, { value: 'OtherGateway' }, { value: 'LegacyGateway' }]} /> },
    { label: '进件单状态', node: <Select options={[{ value: '待遞交' }, { value: '處理中' }, { value: '進件失敗' }, { value: '待风控审核' }, { value: '待重新進件' }, { value: '進件成功' }]} /> },
    { label: '通道进件进度', node: <Select options={[{ value: '未开始' }, { value: '处理中' }, { value: '部分成功' }, { value: '全部成功' }, { value: '失败' }]} /> },
    { label: '更新时间', node: <Input placeholder="YYYY-MM-DD" /> },
    { label: '通道商户号', node: <Input placeholder="输入通道商户号" /> },
    { label: '通道可用状态', node: <Select options={[{ value: '可用' }, { value: '不可用' }]} /> }
  ], []);

  const visibleFilters = expandedFilter ? filterFields : filterFields.filter((f) => coreFilterFields.includes(f.label));

  const selectedHistory = useMemo(() => currentRecord?.history.find((h) => h.id === selectedHistoryId), [currentRecord, selectedHistoryId]);
  const groupedSnapshot = useMemo(() => {
    if (!selectedHistory) return [] as Array<{ group: string; fields: SnapshotField[] }>;
    const map = new Map<string, SnapshotField[]>();
    selectedHistory.snapshot.forEach((f) => {
      if (!map.has(f.group)) map.set(f.group, []);
      map.get(f.group)?.push(f);
    });
    return Array.from(map.entries()).map(([group, fields]) => ({ group, fields }));
  }, [selectedHistory]);

  const openEditModal = (record: OnboardingRecord) => {
    const latest = record.history[0];
    setCurrentRecord(record);
    editForm.setFieldsValue({
      商户名称: record.merchantName,
      商户号: record.mid,
      通道商户号: record.channelMerchantNo,
      结算币种: latest.snapshot.find((x) => x.systemField.includes('结算币种'))?.value || 'HKD',
      商铺地址: latest.snapshot.find((x) => x.systemField.includes('商铺地址'))?.value || '',
      Store参考号: latest.snapshot.find((x) => x.systemField.includes('Store参考号'))?.value || ''
    });
    setEditOpen(true);
  };

  const openHistoryModal = (record: OnboardingRecord) => {
    setCurrentRecord(record);
    setSelectedHistoryId(record.history[0]?.id);
    setHistoryOpen(true);
  };

  const submitReOnboarding = async () => {
    if (!currentRecord) return;
    const values = await editForm.validateFields();
    const hasNonAfp = currentRecord.channels.some((ch) => ch !== 'Adyen_AFP');
    const prev = currentRecord.history[0];
    const now = '2026-04-16 15:30:00';

    const changedFields: SnapshotField[] = [
      {
        group: '商户信息',
        systemField: '通道商户号',
        afpField: 'merchants.id',
        value: values.通道商户号,
        changed: values.通道商户号 !== currentRecord.channelMerchantNo,
        beforeValue: currentRecord.channelMerchantNo,
        afterValue: values.通道商户号
      },
      {
        group: 'Payment Method 相关',
        systemField: '结算币种',
        afpField: 'paymentMethodSettings.currency',
        value: values.结算币种,
        changed: values.结算币种 !== (prev.snapshot.find((x) => x.systemField.includes('结算币种'))?.value || 'HKD'),
        beforeValue: prev.snapshot.find((x) => x.systemField.includes('结算币种'))?.value || 'HKD',
        afterValue: values.结算币种
      },
      {
        group: 'Business Line / Store 相关',
        systemField: '商铺地址',
        afpField: 'stores.address.line1',
        value: values.商铺地址,
        changed: values.商铺地址 !== (prev.snapshot.find((x) => x.systemField.includes('商铺地址'))?.value || ''),
        beforeValue: prev.snapshot.find((x) => x.systemField.includes('商铺地址'))?.value || '',
        afterValue: values.商铺地址
      }
    ];

    const nextStatus: OnboardingStatus = hasNonAfp ? '待风控审核' : '待重新進件';
    const nextProgress: ProgressStatus = hasNonAfp ? '未开始' : '处理中';

    const newAttempt: HistoryAttempt = {
      id: `${currentRecord.id}-h-${Date.now()}`,
      attemptNo: currentRecord.history.length + 1,
      submitTime: now,
      operator: 'Ops User',
      modifyTime: now,
      channel: currentRecord.channels.join(','),
      source: 'OPS修改后重进件',
      onboardingStatus: nextStatus,
      progress: nextProgress,
      result: hasNonAfp ? '处理中' : '处理中',
      errorSummary: hasNonAfp ? '已进入待风控审核' : '已发起重新进件，处理中',
      snapshot: changedFields,
      apiExecutions: requiredApis.map((api, idx) => ({
        order: idx + 1,
        api,
        result: hasNonAfp ? '处理中' : idx < 4 ? '成功' : '处理中',
        code: hasNonAfp ? '102' : idx < 4 ? '200' : '102',
        message: hasNonAfp ? 'queued for risk review' : idx < 4 ? 'ok' : 'processing',
        updatedAt: now
      }))
    };

    setRecords((prevRecords) => prevRecords.map((r) => {
      if (r.id !== currentRecord.id) return r;
      return {
        ...r,
        channelMerchantNo: values.通道商户号,
        onboardingStatus: nextStatus,
        progress: nextProgress,
        latestErrorSummary: newAttempt.errorSummary,
        updatedAt: now,
        history: [newAttempt, ...r.history]
      };
    }));

    message.success(hasNonAfp ? '已提交，状态更新为待风控审核' : '已提交，状态更新为待重新進件 / 處理中');
    setEditOpen(false);
    setCurrentRecord(null);
  };

  const columns: ColumnsType<OnboardingRecord> = [
    { title: '商户名称', dataIndex: 'merchantName', width: 220 },
    { title: '商户号（MID）', dataIndex: 'mid', width: 140 },
    { title: '通道', dataIndex: 'channels', width: 180, render: (v: string[]) => v.join(', ') },
    { title: '通道商户号', dataIndex: 'channelMerchantNo', width: 150 },
    { title: '通道可用状态', dataIndex: 'channelAvailable', width: 130, render: (v) => <Tag>{v}</Tag> },
    { title: '通道进件进度', dataIndex: 'progress', width: 140, render: (v: ProgressStatus) => <Badge status={progressColorMap[v] as any} text={v} /> },
    { title: '进件单状态', dataIndex: 'onboardingStatus', width: 130, render: (v: OnboardingStatus) => <Tag color={statusColorMap[v]}>{v}</Tag> },
    {
      title: '通道返回信息', dataIndex: 'latestErrorSummary', width: 220,
      render: (_, row) => (
        <Popover
          title="接口返回摘要"
          content={<Space direction="vertical">{row.returnMessages.map((item) => <Typography.Text key={item.api}>{item.api}: {item.summary}</Typography.Text>)}</Space>}
        >
          <Button type="link" style={{ paddingInline: 0 }}>{row.latestErrorSummary}</Button>
        </Popover>
      )
    },
    { title: '更新时间', dataIndex: 'updatedAt', width: 180 },
    {
      title: '操作', key: 'action', width: 220, fixed: 'right',
      render: (_, row) => (
        <Space direction="vertical" align="start">
          {row.onboardingStatus === '進件失敗' && <Button type="link" onClick={() => openEditModal(row)}>修改信息重新進件</Button>}
          <Button type="link" onClick={() => openHistoryModal(row)}>進件歷史記錄</Button>
        </Space>
      )
    }
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>商户进件单列表页</Typography.Title>

      <Card>
        <Form layout="vertical">
          <Row gutter={16}>
            {visibleFilters.map((field) => (
              <Col span={8} key={field.label}><Form.Item label={field.label}>{field.node}</Form.Item></Col>
            ))}
            {!expandedFilter && Array.from({ length: 6 - visibleFilters.length }).map((_, i) => <Col span={8} key={`empty-${i}`} />)}
            <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space>
                <Button type="primary">查询</Button>
                <Button>重置</Button>
                <Button type="link" onClick={() => setExpandedFilter((v) => !v)}>{expandedFilter ? '收起' : '展开'}</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="商户进件单列表">
        <Table rowKey="id" scroll={{ x: 1680 }} dataSource={records} columns={columns} pagination={{ pageSize: 8 }} />
      </Card>

      <Modal title="修改信息重新進件" open={editOpen} onCancel={() => setEditOpen(false)} onOk={submitReOnboarding} width={860}>
        <Form form={editForm} layout="vertical">
          <Row gutter={16}>
            <Col span={8}><Form.Item label="商户名称" name="商户名称"><Input disabled /></Form.Item></Col>
            <Col span={8}><Form.Item label="商户号（MID）" name="商户号"><Input disabled /></Form.Item></Col>
            <Col span={8}><Form.Item label="通道商户号" name="通道商户号" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="结算币种" name="结算币种" rules={[{ required: true }]}><Select options={[{ value: 'HKD' }, { value: 'USD' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="商铺地址" name="商铺地址" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="Store参考号" name="Store参考号"><Input /></Form.Item></Col>
          </Row>
          <Typography.Text type="secondary">字段来源：该进件单上一次实际递交给通道的字段快照，仅影响本次进件记录，不回写主档。</Typography.Text>
        </Form>
      </Modal>

      <Modal
        title="進件歷史記錄"
        open={historyOpen}
        onCancel={() => setHistoryOpen(false)}
        footer={<Button onClick={() => setHistoryOpen(false)}>关闭</Button>}
        width={1280}
      >
        {currentRecord && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card title="历史记录列表 / 时间轴总览" size="small">
              <Timeline
                items={currentRecord.history.map((h) => ({
                  color: h.result === '成功' ? 'green' : h.result === '失败' ? 'red' : 'blue',
                  children: (
                    <Card
                      size="small"
                      onClick={() => setSelectedHistoryId(h.id)}
                      style={{ cursor: 'pointer', borderColor: selectedHistoryId === h.id ? '#1F2A37' : undefined }}
                    >
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Typography.Text strong>第 {h.attemptNo} 次递交（{h.id}）</Typography.Text>
                        <Typography.Text>递交时间：{h.submitTime}｜操作人：{h.operator}｜通道：{h.channel}</Typography.Text>
                        <Typography.Text>修改来源：{h.source}｜状态：{h.onboardingStatus}｜进度：{h.progress}</Typography.Text>
                        <Typography.Text>当次结果：{h.result}｜错误摘要：{h.errorSummary || '-'}</Typography.Text>
                      </Space>
                    </Card>
                  )
                }))}
              />
            </Card>

            <Card title="字段快照明细" size="small">
              {selectedHistory ? (
                <Collapse
                  defaultActiveKey={groupedSnapshot.map((g) => g.group)}
                  items={groupedSnapshot.map((group) => ({
                    key: group.group,
                    label: group.group,
                    children: (
                      <Table
                        rowKey={(row) => `${row.group}-${row.systemField}-${row.afpField}`}
                        pagination={false}
                        dataSource={group.fields}
                        columns={[
                          { title: '本系统字段名', dataIndex: 'systemField', width: 220 },
                          { title: 'AFP接口字段名', dataIndex: 'afpField', width: 260 },
                          { title: '值', dataIndex: 'value', width: 220 },
                          { title: '变更标记', dataIndex: 'changed', width: 100, render: (v) => v ? <Tag color="gold">已修改</Tag> : <Tag>未修改</Tag> },
                          { title: '修改前值', dataIndex: 'beforeValue', width: 180, render: (v) => v || '-' },
                          { title: '修改后值', dataIndex: 'afterValue', width: 180, render: (v, row) => v || row.value }
                        ]}
                      />
                    )
                  }))}
                />
              ) : (
                <Typography.Text type="secondary">请选择一条历史记录查看字段快照。</Typography.Text>
              )}
            </Card>

            <Card title="接口执行结果区" size="small">
              <Table
                rowKey={(row) => `${row.order}-${row.api}`}
                pagination={false}
                dataSource={selectedHistory?.apiExecutions || []}
                columns={[
                  { title: '执行顺序', dataIndex: 'order', width: 90 },
                  { title: '接口名称', dataIndex: 'api', width: 360 },
                  { title: '请求结果', dataIndex: 'result', width: 120, render: (v: AttemptResult) => <Tag color={v === '成功' ? 'green' : v === '失败' ? 'red' : 'blue'}>{v}</Tag> },
                  { title: 'code/status', dataIndex: 'code', width: 120 },
                  { title: 'message / error summary', dataIndex: 'message', width: 320 },
                  { title: '更新时间', dataIndex: 'updatedAt', width: 180 }
                ]}
              />
            </Card>
          </Space>
        )}
      </Modal>
    </Space>
  );
};
