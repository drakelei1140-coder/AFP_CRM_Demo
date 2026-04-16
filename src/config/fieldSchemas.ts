export interface FieldGroupSchema {
  key: string;
  title: string;
  fields: string[];
}

export const enterpriseFieldGroups: FieldGroupSchema[] = [
  { key: 'keys', title: '企业主键与关联信息', fields: ['CID', '默认主联系人人员ID', '上級公司ID'] },
  { key: 'names', title: '企业名称信息', fields: ['商戶中文名稱', '商戶中文簡稱', '商戶英文名稱'] },
  { key: 'operation', title: '企业主体与经营信息', fields: ['公司模式', '法律地位', 'MCC Code'] },
  { key: 'basic', title: '企业基础经营数据', fields: ['進件通道(必須)', '每宗交易平均金額', '平均每月營業額'] },
  { key: 'contact', title: '企业联系信息', fields: ['公司電話', '管理員電郵', '微信ID'] },
  { key: 'address', title: '企业地址信息', fields: ['注册地址（原始全文）', '主要营业地址（原始全文）', '郵寄地址'] },
  { key: 'file', title: '企业文件信息', fields: ['商戶篩查報告', '企業架構文件', '財務報表文件'] },
  { key: 'risk', title: '风控 / 业务信息', fields: ['風控類型', '風險等級', '上單來源'] }
];

export const shopFieldGroups: FieldGroupSchema[] = [
  { key: 'keys', title: '商铺主键与关联信息', fields: ['SID', '所属企业编号（CID）', '默认主联系人人员ID'] },
  { key: 'names', title: '商铺名称信息', fields: ['商铺中文名称', '商铺英文名称', '门头名称'] },
  { key: 'operation', title: '商铺主体与经营信息', fields: ['商铺类型', '经营模式', 'MCC Code'] },
  { key: 'basic', title: '商铺基础经营数据', fields: ['進件通道(必須)', '每宗交易平均金額', '平均每月營業額'] },
  { key: 'contact', title: '商铺联系信息', fields: ['商铺电话', '管理员电邮', '运营电邮'] },
  { key: 'address', title: '商铺地址信息', fields: ['门店地址（原始全文）', '门店地址-城市', '门店地址-国家'] },
  { key: 'files', title: '商铺文件信息', fields: ['门头照片', '营业场所证明', '租赁合同 / 场地证明'] },
  { key: 'risk', title: '风控 / 业务信息', fields: ['風控類型', '風險等級', '上單來源'] }
];

export const merchantFieldGroups: FieldGroupSchema[] = [
  { key: 'keys', title: '主键与关联信息', fields: ['MID', 'CID', 'SID', '渠道编码', '服务编码', '进件通道'] },
  { key: 'business', title: '商户资料信息', fields: ['清算模式', 'Store参考号 / 门店编码', 'H5支付域名', '結算摘要前綴', '卡類型', '結算身份證號'] },
  { key: 'settlement', title: '结算与银行信息', fields: ['結算週期', '結算幣種', '打款銀行', 'FPS賬號', '收款銀行賬戶名稱'] },
  { key: 'channel', title: '通道选择信息', fields: ['通道列表'] }
];
