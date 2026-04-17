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

type FieldDef = {
  group: string;
  key: string;
  systemField: string;
  afpField: string;
  required?: boolean;
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

const BASE_FIELDS: FieldDef[] = [
  // Company LE
  { group: 'Company Legal Entity', key: 'companyReference', systemField: '企业参考号 / 企业外部参考号', afpField: 'reference', required: true },
  { group: 'Company Legal Entity', key: 'companyType', systemField: '企业类型', afpField: 'type', required: true },
  { group: 'Company Legal Entity', key: 'companyLegalName', systemField: '企业法定名称', afpField: 'organization.legalName', required: true },
  { group: 'Company Legal Entity', key: 'companyDba', systemField: '企业营业名称 / DBA', afpField: 'organization.doingBusinessAs' },
  { group: 'Company Legal Entity', key: 'companyDescription', systemField: '企业描述', afpField: 'organization.description' },
  { group: 'Company Legal Entity', key: 'companyPhoneNumber', systemField: '企业联系电话', afpField: 'organization.phone.number' },
  { group: 'Company Legal Entity', key: 'companyPhoneCountryCode', systemField: '企业电话国家区号', afpField: 'organization.phone.phoneCountryCode' },
  { group: 'Company Legal Entity', key: 'companyPhoneType', systemField: '企业电话类型', afpField: 'organization.phone.type' },
  { group: 'Company Legal Entity', key: 'companyEmail', systemField: '企业邮箱', afpField: 'organization.email' },
  { group: 'Company Legal Entity', key: 'registeredStreet', systemField: '注册地址-街道', afpField: 'organization.registeredAddress.street', required: true },
  { group: 'Company Legal Entity', key: 'registeredStreet2', systemField: '注册地址-补充地址', afpField: 'organization.registeredAddress.street2' },
  { group: 'Company Legal Entity', key: 'registeredCity', systemField: '注册地址-城市', afpField: 'organization.registeredAddress.city' },
  { group: 'Company Legal Entity', key: 'registeredState', systemField: '注册地址-州 / 省', afpField: 'organization.registeredAddress.stateOrProvince' },
  { group: 'Company Legal Entity', key: 'registeredPostalCode', systemField: '注册地址-邮编', afpField: 'organization.registeredAddress.postalCode' },
  { group: 'Company Legal Entity', key: 'registeredCountry', systemField: '注册地址-国家', afpField: 'organization.registeredAddress.country', required: true },
  { group: 'Company Legal Entity', key: 'principalStreet', systemField: '主要营业地址-街道', afpField: 'organization.principalPlaceOfBusiness.street' },
  { group: 'Company Legal Entity', key: 'principalStreet2', systemField: '主要营业地址-补充地址', afpField: 'organization.principalPlaceOfBusiness.street2' },
  { group: 'Company Legal Entity', key: 'principalCity', systemField: '主要营业地址-城市', afpField: 'organization.principalPlaceOfBusiness.city' },
  { group: 'Company Legal Entity', key: 'principalState', systemField: '主要营业地址-州 / 省', afpField: 'organization.principalPlaceOfBusiness.stateOrProvince' },
  { group: 'Company Legal Entity', key: 'principalPostalCode', systemField: '主要营业地址-邮编', afpField: 'organization.principalPlaceOfBusiness.postalCode' },
  { group: 'Company Legal Entity', key: 'principalCountry', systemField: '主要营业地址-国家', afpField: 'organization.principalPlaceOfBusiness.country' },
  { group: 'Company Legal Entity', key: 'incorporationDate', systemField: '成立日期', afpField: 'organization.dateOfIncorporation' },
  { group: 'Company Legal Entity', key: 'registrationNumber', systemField: '企业注册号', afpField: 'organization.registrationNumber' },
  { group: 'Company Legal Entity', key: 'governingLawCountry', systemField: '企业治理法律所在国', afpField: 'organization.countryOfGoverningLaw' },
  { group: 'Company Legal Entity', key: 'taxCountry', systemField: '企业税务国家', afpField: 'organization.taxInformation.country' },
  { group: 'Company Legal Entity', key: 'taxNumber', systemField: '企业税号', afpField: 'organization.taxInformation.number' },
  { group: 'Company Legal Entity', key: 'taxType', systemField: '企业税号类型', afpField: 'organization.taxInformation.type' },
  { group: 'Company Legal Entity', key: 'vatNumber', systemField: 'VAT号', afpField: 'organization.vatNumber' },
  { group: 'Company Legal Entity', key: 'vatAbsenceReason', systemField: '无VAT原因', afpField: 'organization.vatAbsenceReason' },
  { group: 'Company Legal Entity', key: 'stockMarketIdentifier', systemField: '上市市场标识', afpField: 'organization.stockData.marketIdentifier' },
  { group: 'Company Legal Entity', key: 'stockNumber', systemField: '股票代码', afpField: 'organization.stockData.stockNumber' },
  // Individual LE
  { group: 'Individual Legal Entity', key: 'personRole', systemField: '人员角色', afpField: 'entityAssociations.type', required: true },
  { group: 'Individual Legal Entity', key: 'personReference', systemField: '人员参考号 / 外部参考号', afpField: 'reference', required: true },
  { group: 'Individual Legal Entity', key: 'personType', systemField: '人员类型', afpField: 'type', required: true },
  { group: 'Individual Legal Entity', key: 'personFirstName', systemField: '名', afpField: 'individual.name.firstName', required: true },
  { group: 'Individual Legal Entity', key: 'personInfix', systemField: '中间名 / 前缀', afpField: 'individual.name.infix' },
  { group: 'Individual Legal Entity', key: 'personLastName', systemField: '姓', afpField: 'individual.name.lastName', required: true },
  { group: 'Individual Legal Entity', key: 'personNationality', systemField: '国籍', afpField: 'individual.nationality' },
  { group: 'Individual Legal Entity', key: 'personDob', systemField: '出生日期', afpField: 'individual.birthData.dateOfBirth' },
  { group: 'Individual Legal Entity', key: 'personEmail', systemField: '邮箱', afpField: 'individual.email' },
  { group: 'Individual Legal Entity', key: 'personPhone', systemField: '联系电话', afpField: 'individual.phone.number' },
  { group: 'Individual Legal Entity', key: 'personPhoneType', systemField: '电话类型', afpField: 'individual.phone.type' },
  { group: 'Individual Legal Entity', key: 'residentialStreet', systemField: '居住地址-街道', afpField: 'individual.residentialAddress.street', required: true },
  { group: 'Individual Legal Entity', key: 'residentialStreet2', systemField: '居住地址-补充地址', afpField: 'individual.residentialAddress.street2' },
  { group: 'Individual Legal Entity', key: 'residentialCity', systemField: '居住地址-城市', afpField: 'individual.residentialAddress.city' },
  { group: 'Individual Legal Entity', key: 'residentialState', systemField: '居住地址-州 / 省', afpField: 'individual.residentialAddress.stateOrProvince' },
  { group: 'Individual Legal Entity', key: 'residentialPostalCode', systemField: '居住地址-邮编', afpField: 'individual.residentialAddress.postalCode' },
  { group: 'Individual Legal Entity', key: 'residentialCountry', systemField: '居住地址-国家', afpField: 'individual.residentialAddress.country', required: true },
  { group: 'Individual Legal Entity', key: 'idType', systemField: '证件类型', afpField: 'individual.identificationData.type', required: true },
  { group: 'Individual Legal Entity', key: 'idNumber', systemField: '证件号码', afpField: 'individual.identificationData.number' },
  { group: 'Individual Legal Entity', key: 'idExpiryDate', systemField: '证件到期日', afpField: 'individual.identificationData.expiryDate' },
  { group: 'Individual Legal Entity', key: 'idIssuerState', systemField: '签发州 / 省', afpField: 'individual.identificationData.issuerState' },
  { group: 'Individual Legal Entity', key: 'personTaxCountry', systemField: '税务国家', afpField: 'individual.taxInformation.country' },
  { group: 'Individual Legal Entity', key: 'personTaxNumber', systemField: '税号', afpField: 'individual.taxInformation.number' },
  { group: 'Individual Legal Entity', key: 'personTaxType', systemField: '税号类型', afpField: 'individual.taxInformation.type' },
  // LE association
  { group: 'Company LE 与 Individual LE 关联关系', key: 'associateLegalEntityId', systemField: '关联的人员ID / 人员参考号', afpField: 'entityAssociations.legalEntityId', required: true },
  { group: 'Company LE 与 Individual LE 关联关系', key: 'associateType', systemField: '关联关系类型', afpField: 'entityAssociations.type', required: true },
  { group: 'Company LE 与 Individual LE 关联关系', key: 'ownershipPct', systemField: '持股比例（如平台有）', afpField: '扩展字段' },
  { group: 'Company LE 与 Individual LE 关联关系', key: 'isUbo', systemField: '是否最终受益人', afpField: 'entityAssociations.type' },
  // Account Holder
  { group: 'Account Holder', key: 'balancePlatformId', systemField: 'Balance Platform ID', afpField: 'balancePlatform', required: true },
  { group: 'Account Holder', key: 'accountHolderReference', systemField: 'Account Holder 参考号', afpField: 'reference', required: true },
  { group: 'Account Holder', key: 'accountHolderLegalEntityId', systemField: '关联企业 LE ID', afpField: 'legalEntityId', required: true },
  { group: 'Account Holder', key: 'capabilities', systemField: '所申请能力集合', afpField: 'capabilities', required: true },
  // Balance Account
  { group: 'Balance Account', key: 'balanceAccountHolderId', systemField: '关联 Account Holder ID', afpField: 'accountHolderId', required: true },
  { group: 'Balance Account', key: 'balanceAccountReference', systemField: 'Balance Account 参考号', afpField: 'reference', required: true },
  { group: 'Balance Account', key: 'defaultCurrencyCode', systemField: '默认币种 / 结算币种', afpField: 'defaultCurrencyCode' },
  // Business line
  { group: 'Business Line', key: 'businessLineReference', systemField: 'Business Line 参考号', afpField: 'reference', required: true },
  { group: 'Business Line', key: 'businessLineLegalEntityId', systemField: '关联企业 LE ID', afpField: 'legalEntityId', required: true },
  { group: 'Business Line', key: 'service', systemField: '服务类型', afpField: 'service', required: true },
  { group: 'Business Line', key: 'salesChannels', systemField: '销售渠道', afpField: 'salesChannels', required: true },
  { group: 'Business Line', key: 'industryCode', systemField: '行业代码 / MCC映射值', afpField: 'industryCode', required: true },
  { group: 'Business Line', key: 'businessLineDescription', systemField: '业务线描述 / 名称', afpField: 'description' },
  // Store
  { group: 'Store', key: 'storeMerchantId', systemField: 'Merchant Account ID', afpField: 'merchantId（路径参数）', required: true },
  { group: 'Store', key: 'storeReference', systemField: 'Store参考号 / 门店编码', afpField: 'reference', required: true },
  { group: 'Store', key: 'storeDescription', systemField: 'Store描述 / 门店名称', afpField: 'description', required: true },
  { group: 'Store', key: 'storePhone', systemField: '门店联系电话', afpField: 'phoneNumber', required: true },
  { group: 'Store', key: 'shopperStatement', systemField: '账单抬头 / Shopper Statement', afpField: 'shopperStatement', required: true },
  { group: 'Store', key: 'businessLineIds', systemField: '绑定 Business Line IDs', afpField: 'businessLineIds', required: true },
  { group: 'Store', key: 'storeStreet', systemField: '门店地址-街道', afpField: 'address.street', required: true },
  { group: 'Store', key: 'storeStreet2', systemField: '门店地址-补充地址', afpField: 'address.street2' },
  { group: 'Store', key: 'storeCity', systemField: '门店地址-城市', afpField: 'address.city' },
  { group: 'Store', key: 'storeState', systemField: '门店地址-州 / 省', afpField: 'address.stateOrProvince' },
  { group: 'Store', key: 'storePostalCode', systemField: '门店地址-邮编', afpField: 'address.postalCode' },
  { group: 'Store', key: 'storeCountry', systemField: '门店地址-国家', afpField: 'address.country', required: true },
  // Payment method (no rates)
  { group: 'Payment Method', key: 'paymentProduct', systemField: '支付产品', afpField: 'paymentMethod / type', required: true },
  { group: 'Payment Method', key: 'pmMerchantId', systemField: 'Merchant Account ID', afpField: 'merchantId（路径参数）', required: true },
  { group: 'Payment Method', key: 'pmStoreId', systemField: 'Store ID（如适用）', afpField: 'storeId' },
  { group: 'Payment Method', key: 'pmScope', systemField: '支付方式适用范围', afpField: '扩展字段' }
];

const HISTORY_RESULT_FIELDS: FieldDef[] = [
  { group: 'Account Holder', key: 'capVerification', systemField: 'capability-verificationStatus', afpField: 'capabilities.*.verificationStatus' },
  { group: 'Account Holder', key: 'capAllowed', systemField: 'capability-allowed', afpField: 'capabilities.*.allowed' },
  { group: 'Account Holder', key: 'capEnabled', systemField: 'capability-enabled', afpField: 'capabilities.*.enabled' },
  { group: 'Balance Account', key: 'balanceAccountId', systemField: 'Balance Account ID', afpField: '返回字段' },
  { group: 'Balance Account', key: 'balanceAccountStatus', systemField: 'Balance Account 状态', afpField: '返回字段' },
  { group: 'Store', key: 'storeId', systemField: 'Store ID', afpField: '返回字段' },
  { group: 'Store', key: 'storeStatus', systemField: 'Store状态', afpField: '返回字段' },
  { group: 'Payment Method', key: 'pmEnabled', systemField: '是否开通', afpField: 'enabled / allowed' },
  { group: 'Payment Method', key: 'paymentMethodId', systemField: '通道支付方式配置ID', afpField: 'paymentMethodId' },
  { group: 'Payment Method', key: 'pmCreateResult', systemField: 'Payment Method 创建结果', afpField: '返回字段' },
  { group: 'Payment Method', key: 'pmAvailable', systemField: 'Payment Method 可用状态', afpField: 'allowed / enabled' },
  { group: 'Payment Method', key: 'pmReturnMessage', systemField: 'Payment Method 返回信息', afpField: '返回字段' }
];

const DEFAULT_RETRY_VALUES: Record<string, string> = Object.fromEntries(BASE_FIELDS.map((f) => [f.key, '']));

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
          { group: 'Company Legal Entity', systemField: '企业法定名称', afpField: 'organization.legalName', value: 'HK Food Group Ltd' },
          { group: 'Store', systemField: 'Store参考号 / 门店编码', afpField: 'reference', value: 'STORE-10001' },
          { group: 'Payment Method', systemField: '支付产品', afpField: 'paymentMethod / type', value: 'Visa,Mastercard,UnionPay' },
          { group: 'Payment Method', systemField: 'Payment Method 可用状态', afpField: 'allowed / enabled', value: 'enabled', changed: true, beforeValue: 'disabled', afterValue: 'enabled' }
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
          { group: 'Payment Method', systemField: '支付产品', afpField: 'paymentMethod / type', value: 'Visa,Mastercard,UnionPay' },
          { group: 'Payment Method', systemField: 'Payment Method 返回信息', afpField: '返回字段', value: 'currency invalid' }
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
          { group: 'Store', systemField: '门店地址-街道', afpField: 'address.street', value: '' },
          { group: 'Business Line', systemField: '行业代码 / MCC映射值', afpField: 'industryCode', value: '5812' },
          { group: 'Payment Method', systemField: 'Payment Method 返回信息', afpField: '返回字段', value: 'line1 required' }
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
  }
];

const coreFilterFields = ['商户名称', '商户号（MID）', '通道', '进件单状态', '通道进件进度', '更新时间'];

const groupOrder = [
  'Company Legal Entity',
  'Individual Legal Entity',
  'Company LE 与 Individual LE 关联关系',
  'Account Holder',
  'Balance Account',
  'Business Line',
  'Store',
  'Payment Method'
];

const groupFields = (defs: FieldDef[]) => {
  const map = new Map<string, FieldDef[]>();
  defs.forEach((def) => {
    if (!map.has(def.group)) map.set(def.group, []);
    map.get(def.group)?.push(def);
  });
  return groupOrder.map((group) => ({ group, fields: map.get(group) || [] })).filter((g) => g.fields.length > 0);
};

const RETRY_GROUPS = groupFields(BASE_FIELDS);
const HISTORY_GROUPS = groupFields([...BASE_FIELDS, ...HISTORY_RESULT_FIELDS]);

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

  const openEditModal = (record: OnboardingRecord) => {
    const latest = record.history[0];
    const snapshotMap = new Map(latest.snapshot.map((f) => [f.systemField, f.afterValue || f.value]));
    const values: Record<string, string> = { ...DEFAULT_RETRY_VALUES };

    BASE_FIELDS.forEach((field) => {
      values[field.key] = snapshotMap.get(field.systemField) || values[field.key] || '';
    });

    values.companyLegalName = values.companyLegalName || record.merchantName;
    values.pmMerchantId = values.pmMerchantId || record.channelMerchantNo;
    values.storeMerchantId = values.storeMerchantId || record.channelMerchantNo;

    setCurrentRecord(record);
    editForm.setFieldsValue(values);
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
    const now = '2026-04-17 09:30:00';

    const previousMap = new Map(prev.snapshot.map((s) => [s.systemField, s.afterValue || s.value]));

    const changedFields: SnapshotField[] = BASE_FIELDS.map((field) => {
      const newValue = String(values[field.key] ?? '');
      const beforeValue = previousMap.get(field.systemField) || '';
      const changed = beforeValue !== newValue;
      return {
        group: field.group,
        systemField: field.systemField,
        afpField: field.afpField,
        value: newValue,
        changed,
        beforeValue,
        afterValue: newValue
      };
    });

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
      result: '处理中',
      errorSummary: hasNonAfp ? '已进入待风控审核' : '已发起重新进件，处理中',
      snapshot: [...changedFields,
        { group: 'Account Holder', systemField: 'capability-verificationStatus', afpField: 'capabilities.*.verificationStatus', value: hasNonAfp ? 'pending-risk' : 'pending-channel' },
        { group: 'Payment Method', systemField: 'Payment Method 返回信息', afpField: '返回字段', value: hasNonAfp ? 'queued by risk gate' : 'processing' }
      ],
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
        channelMerchantNo: values.pmMerchantId || r.channelMerchantNo,
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

  const snapshotMap = useMemo(() => {
    const map = new Map<string, SnapshotField>();
    (selectedHistory?.snapshot || []).forEach((s) => map.set(s.systemField, s));
    return map;
  }, [selectedHistory]);

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

      <Modal title="修改信息重新進件" open={editOpen} onCancel={() => setEditOpen(false)} onOk={submitReOnboarding} width={1220}>
        <Form form={editForm} layout="vertical">
          <Collapse
            defaultActiveKey={RETRY_GROUPS.map((g) => g.group)}
            items={RETRY_GROUPS.map((group) => ({
              key: group.group,
              label: group.group,
              children: (
                <Table
                  rowKey={(row) => row.key}
                  pagination={false}
                  dataSource={group.fields}
                  columns={[
                    { title: '本系统字段名', dataIndex: 'systemField', width: 260 },
                    { title: 'AFP接口字段名', dataIndex: 'afpField', width: 360 },
                    {
                      title: '当前值',
                      dataIndex: 'key',
                      render: (_, row) => (
                        <Form.Item
                          name={row.key}
                          style={{ marginBottom: 0 }}
                          rules={row.required ? [{ required: true, message: '必填字段不能为空' }] : undefined}
                        >
                          <Input placeholder={row.required ? '必填' : '可选'} />
                        </Form.Item>
                      )
                    }
                  ]}
                />
              )
            }))}
          />
        </Form>
      </Modal>

      <Modal
        title="進件歷史記錄"
        open={historyOpen}
        onCancel={() => setHistoryOpen(false)}
        footer={<Button onClick={() => setHistoryOpen(false)}>关闭</Button>}
        width={1320}
      >
        {currentRecord && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card title="历史记录列表 / 时间轴总览" size="small">
              <Timeline
                items={currentRecord.history.map((h) => ({
                  color: h.result === '成功' ? 'green' : h.result === '失败' ? 'red' : 'blue',
                  children: (
                    <Card size="small" onClick={() => setSelectedHistoryId(h.id)} style={{ cursor: 'pointer', borderColor: selectedHistoryId === h.id ? '#1F2A37' : undefined }}>
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Typography.Text strong>第 {h.attemptNo} 次递交（{h.id}）</Typography.Text>
                        <Typography.Text>递交时间：{h.submitTime}｜修改时间：{h.modifyTime}｜操作人：{h.operator}｜通道：{h.channel}</Typography.Text>
                        <Typography.Text>修改来源：{h.source}｜状态：{h.onboardingStatus}｜进度：{h.progress}</Typography.Text>
                        <Typography.Text>修改字段：{h.snapshot.filter((field) => field.changed).map((field) => field.systemField).join('、') || '无'}</Typography.Text>
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
                  defaultActiveKey={HISTORY_GROUPS.map((g) => g.group)}
                  items={HISTORY_GROUPS.map((group) => {
                    const rows = group.fields.map((field) => {
                      const snap = snapshotMap.get(field.systemField);
                      const beforeValue = snap?.beforeValue ?? snap?.value ?? '-';
                      const afterValue = snap?.afterValue ?? snap?.value ?? '-';
                      return {
                        key: field.key,
                        systemField: field.systemField,
                        afpField: field.afpField,
                        beforeValue,
                        afterValue
                      };
                    });

                    const hasData = rows.some((row) => row.beforeValue !== '-' || row.afterValue !== '-');
                    if (!hasData) return null;

                    return {
                      key: group.group,
                      label: group.group,
                      children: (
                        <Table
                          rowKey={(row) => row.key}
                          pagination={false}
                          dataSource={rows}
                          columns={[
                            { title: '本系统字段名', dataIndex: 'systemField', width: 260 },
                            { title: 'AFP接口字段名', dataIndex: 'afpField', width: 360 },
                            { title: '修改前值', dataIndex: 'beforeValue', width: 220 },
                            { title: '修改后值', dataIndex: 'afterValue', width: 220 }
                          ]}
                        />
                      )
                    };
                  }).filter(Boolean) as any}
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
