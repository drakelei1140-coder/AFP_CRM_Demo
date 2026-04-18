import { Enterprise } from './types';

const baseSections = {
  keys: {
    CID: 'CID-10001',
    '企业LE ID': 'LE-90001',
    '企业LE类型': 'Organization',
    '企业LE参考号': 'LE-REF-001',
    '默认主联系人人员ID': 'P-321',
    '上級公司ID': 'PARENT-01'
  },
  names: {
    '商戶中文名稱': 'KPay 餐饮控股有限公司',
    '商戶中文簡稱': 'KPay 餐饮',
    '商戶英文名稱': 'KPay Dining Holdings Limited',
    '商戶英文簡稱': 'KPay Dining',
    '商戶其它名稱': 'KPay Food Group',
    '商戶所有名稱（中文）': 'KPay 餐饮控股有限公司; KPay 餐饮',
    '商戶所有名稱（英文）': 'KPay Dining Holdings Limited; KPay Dining',
    '切換商戶顯示名稱（中文）': 'KPay 餐饮',
    '切換商戶顯示名稱（英文）': 'KPay Dining',
    '商業登記證名稱': 'KPay 餐饮控股有限公司',
    '公司登記証名稱(非必須)': 'KPay Dining Holdings Ltd.'
  },
  operation: {
    '公司模式': '连锁',
    '是否子公司': '否',
    '公司結構': '有限公司',
    '行業分類/業務性質/產品服務': '餐饮, 零售',
    'MCC Code': '5812',
    '進階MCC Code': '5812A',
    'special MCC 附件': 'special_mcc.pdf',
    '小微商戶': '否',
    'SME 設定': '是',
    '成立日期': '2019-03-12',
    '法律地位': '有限公司',
    '僱員人數': '186',
    '注冊資本': 'HKD 5,000,000'
  },
  basic: {
    '進件通道(必須)': 'Adyen-AFP',
    '每宗交易平均金額': '320',
    '每宗交易最大交易額': '2400',
    '預計每年交易宗數': '280000',
    '過往拒付比例': '0.18%',
    '過往退款比例': '0.42%',
    '平均每月營業額': 'HKD 2,600,000',
    '經營方式': '线下门店 + 外卖',
    '税务申报分类': '一般纳税',
    '税务业务类型': '本地销售',
    '企業描述': '主要经营连锁餐饮业务',
    'VAT号': '-',
    '无VAT原因': 'HK non-VAT'
  },
  contact: {
    '公司電話': '+852 2811 0101',
    '手提電話': '+852 9876 1234',
    '管理員電郵': 'ops@kpay.demo',
    '運營電郵': 'biz@kpay.demo',
    '接收營銷資訊': '是',
    '微信ID': 'kpay-demo'
  },
  address: {
    '註冊辦事處地址': '香港中环皇后大道中 99 号',
    '註冊辦事處地址(英文)': '99 Queen\'s Road Central, Hong Kong',
    '注册地址（原始全文）': '香港中环皇后大道中 99 号',
    '注册地址-街道': '皇后大道中',
    '注册地址-补充地址': '99号',
    '注册地址-城市': 'Hong Kong',
    '注册地址-州/省': '-',
    '注册地址-邮编': '999077',
    '注册地址-国家': 'CN-HK',
    '主要营业地址（原始全文）': '香港尖沙咀海港城 T1',
    '主要营业地址-街道': '海港城',
    '主要营业地址-补充地址': 'T1',
    '主要营业地址-城市': 'Hong Kong',
    '主要营业地址-州/省': '-',
    '主要营业地址-邮编': '999077',
    '主要营业地址-国家': 'CN-HK'
  },
  file: {
    '商戶篩查報告': 'merchant_screening.pdf',
    '企業架構文件': 'org_chart.pdf',
    '財務報表文件': 'financial_2025.pdf',
    '商業登記證號碼': 'BR-0012395',
    '證書有效期': '2027-12-31'
  },
  risk: {
    '風控類型': '标准',
    '風險等級': '低',
    '審核類型': '新建审核',
    '上單來源': 'CRM',
    '服務類型': '收单',
    '合作夥伴推薦人': 'Tom Lee',
    '合作夥伴編號': 'PT-2201'
  },
  blah: {
    '业务线ID': 'BL-1001',
    '业务线类型': 'POS',
    '销售渠道': 'Direct',
    '资金流/清算模式': 'T+1',
    '账户持有人ID': 'AH-9988',
    '账户持有人状态': 'Active'
  }
};

const makeEnterprise = (idx: number, patch: Partial<Enterprise>): Enterprise => ({
  id: `ent-${idx}`,
  cid: `CID-10${idx}`,
  leId: `LE-90${idx}`,
  name: `Demo Enterprise ${idx}`,
  shortName: `Demo ${idx}`,
  englishName: `Demo Enterprise ${idx}`,
  region: idx % 2 ? 'HK' : 'SG',
  reviewStatus: '待审核',
  enableStatus: null,
  channels: ['Adyen-AFP'],
  companyMode: '直营',
  legalStatus: '有限公司',
  phone: `+852 2800 00${idx}`,
  email: `enterprise${idx}@demo.com`,
  createdAt: '2026-03-01 10:00:00',
  updatedAt: '2026-04-10 16:30:00',
  creator: idx % 2 ? 'OPS-Lily' : 'DMO',
  source: idx % 2 ? ['CRM'] : ['DMO'],
  foundedAt: '2020-01-01',
  overview: {
    '企业主显示名称': `Demo Enterprise ${idx}`,
    CID: `CID-10${idx}`,
    '企业 LE ID': `LE-90${idx}`,
    '下属商铺数量': 2 + idx,
    'MID 数量': 3 + idx,
    '進件通道(必須)': 'Adyen-AFP',
    '上單來源': idx % 2 ? 'CRM' : 'DMO',
    '創建時間': '2026-03-01 10:00:00',
    '更新時間': '2026-04-10 16:30:00'
  },
  sections: baseSections,
  afpSummary: [
    { key: 'legalEntityId', value: `LE-AFP-${idx}` },
    { key: 'accountHolderId', value: `AH-AFP-${idx}` },
    { key: 'kycStatus', value: 'pendingReview' }
  ],
  afpDetails: {
    legalEntityId: `LE-AFP-${idx}`,
    legalEntityReference: `LE-REF-${idx}`,
    accountHolderId: `AH-AFP-${idx}`,
    accountHolderStatus: 'active',
    businessLineId: `BL-AFP-${idx}`,
    verificationStatus: 'pendingReview',
    payoutMethod: 'bankAccount'
  },
  devices: [{ id: `DEV-${idx}01`, model: 'A920', status: '在线', bindShop: 'Central Shop' }],
  relatedCompanies: [{ id: `RC-${idx}`, name: `关联公司 ${idx}`, relation: '母公司' }],
  relatedPeople: [{ id: `RP-${idx}`, name: 'Wong Ken', role: '法人', mobile: '+852 6200 1001' }],
  shops: [{ id: `SID-${idx}1`, name: 'Central Shop', region: 'HK', enableStatus: '启用', reviewStatus: '审核通过' }],
  mids: [{ id: `MID-${idx}1`, shopName: 'Central Shop', channel: 'Adyen-AFP', status: 'Active', updatedAt: '2026-04-12 09:30:00' }],
  timeline: [{ id: `tl-${idx}-1`, time: '2026-03-01 10:00:00', operator: 'OPS-Lily', action: '创建企业', detail: '初始化待审核' }],
  ...patch
});

export const enterpriseMockData: Enterprise[] = [
  makeEnterprise(1, { name: 'HK Food Group', reviewStatus: '待审核', enableStatus: null, channels: ['Adyen-AFP', 'Adyen-payfac'] }),
  makeEnterprise(2, { name: 'AFP Pure Retail', reviewStatus: '待审核', enableStatus: null, channels: ['Adyen-AFP'] }),
  makeEnterprise(3, { name: 'Risk Queue Co', reviewStatus: '待风控审核', enableStatus: null, channels: ['Adyen-payfac'] }),
  makeEnterprise(9, { name: 'Third Party Pending Co', reviewStatus: '待第三方审核', enableStatus: null, channels: ['Adyen-AFP', 'Other'] }),
  makeEnterprise(4, { name: 'Approved Active Co', reviewStatus: '审核通过', enableStatus: '启用', channels: ['Adyen-AFP'], companyMode: '连锁' }),
  makeEnterprise(5, { name: 'Approved Disabled Co', reviewStatus: '审核通过', enableStatus: '停用', channels: ['Adyen-AFP', 'Adyen-payfac'] }),
  makeEnterprise(6, { name: 'Rejected Corp', reviewStatus: '审核不通过', enableStatus: null, channels: ['Adyen-payfac'] }),
  makeEnterprise(7, { name: 'AFP Only Travel', reviewStatus: '审核通过', enableStatus: '启用', channels: ['Adyen-AFP'] }),
  makeEnterprise(8, { name: 'Multi Channel Mixed', reviewStatus: '待风控审核', enableStatus: null, channels: ['Adyen-AFP', 'Adyen-payfac', 'Other'] })
];
