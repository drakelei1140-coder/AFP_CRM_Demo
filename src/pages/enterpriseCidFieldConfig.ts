export interface CidFieldConfig {
  key: string;
  label: string;
  group: string;
  source: string;
  note: string;
  row: number;
  readonly: boolean;
}

export const cidFieldConfig: CidFieldConfig[] = [
  {
    "row": 6,
    "label": "CID",
    "group": "主键/关联",
    "source": "系统新增",
    "note": "企业主表主键",
    "key": "CID",
    "readonly": true
  },
  {
    "row": 7,
    "label": "企业LE ID",
    "group": "主键/关联",
    "source": "AFP补充",
    "note": "企业LE返回ID，建议唯一索引",
    "key": "企业LE ID",
    "readonly": true
  },
  {
    "row": 8,
    "label": "企业LE类型",
    "group": "主键/关联",
    "source": "AFP补充",
    "note": "旧口径字段，建议与“LE类型（企业）”合并治理；新逻辑以下方标准字段为主",
    "key": "企业LE类型",
    "readonly": true
  },
  {
    "row": 9,
    "label": "企业LE参考号",
    "group": "主键/关联",
    "source": "AFP补充",
    "note": "AFP/Adyen幂等与追踪",
    "key": "企业LE参考号",
    "readonly": true
  },
  {
    "row": 10,
    "label": "默认主联系人人员ID",
    "group": "主键/关联",
    "source": "系统新增",
    "note": "可指向人员表中的默认联系人",
    "key": "默认主联系人人员ID",
    "readonly": true
  },
  {
    "row": 11,
    "label": "進件通道(必須)",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "CID层保留多值，用于记录该公司历史/当前已进件的全部通道；实际执行口径仍以MID/第三方MID为准",
    "key": "進件通道(必須)",
    "readonly": false
  },
  {
    "row": 12,
    "label": "商戶中文名稱",
    "group": "企业名称",
    "source": "HK原字段",
    "note": "Adyen无统一标准字段，建议作为本地语言法定名保留",
    "key": "商戶中文名稱",
    "readonly": false
  },
  {
    "row": 13,
    "label": "商戶中文簡稱",
    "group": "企业名称",
    "source": "HK原字段",
    "note": "",
    "key": "商戶中文簡稱",
    "readonly": false
  },
  {
    "row": 14,
    "label": "商戶英文名稱",
    "group": "企业名称",
    "source": "HK原字段",
    "note": "建议作为企业法定名称（英文注册名）",
    "key": "商戶英文名稱",
    "readonly": false
  },
  {
    "row": 15,
    "label": "商戶英文簡稱",
    "group": "企业名称",
    "source": "HK原字段",
    "note": "",
    "key": "商戶英文簡稱",
    "readonly": false
  },
  {
    "row": 16,
    "label": "商戶其它名稱",
    "group": "企业名称",
    "source": "HK原字段",
    "note": "",
    "key": "商戶其它名稱",
    "readonly": false
  },
  {
    "row": 17,
    "label": "商戶所有名稱（中文）",
    "group": "企业名称",
    "source": "HK原字段",
    "note": "",
    "key": "商戶所有名稱（中文）",
    "readonly": false
  },
  {
    "row": 18,
    "label": "商戶所有名稱（英文）",
    "group": "企业名称",
    "source": "HK原字段",
    "note": "",
    "key": "商戶所有名稱（英文）",
    "readonly": false
  },
  {
    "row": 19,
    "label": "商戶篩查報告",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "风险/业务线资料，正式归CID中的BL域",
    "key": "商戶篩查報告",
    "readonly": false
  },
  {
    "row": 20,
    "label": "風控類型",
    "group": "风控/业务",
    "source": "HK原字段",
    "note": "",
    "key": "風控類型",
    "readonly": false
  },
  {
    "row": 21,
    "label": "切換商戶顯示名稱（中文）",
    "group": "企业名称",
    "source": "HK原字段",
    "note": "企业显示名称；归CID，不作为AFP Store主字段",
    "key": "切換商戶顯示名稱（中文）",
    "readonly": false
  },
  {
    "row": 22,
    "label": "切換商戶顯示名稱（英文）",
    "group": "企业名称",
    "source": "HK原字段",
    "note": "企业显示名称；归CID，不作为AFP Store主字段",
    "key": "切換商戶顯示名稱（英文）",
    "readonly": false
  },
  {
    "row": 23,
    "label": "風險等級",
    "group": "风控/业务",
    "source": "HK原字段",
    "note": "风险/业务线资料，正式归CID中的BL域",
    "key": "風險等級",
    "readonly": false
  },
  {
    "row": 24,
    "label": "風險評估報告",
    "group": "风控/业务",
    "source": "HK原字段",
    "note": "风险/业务线资料，正式归CID中的BL域",
    "key": "風險評估報告",
    "readonly": false
  },
  {
    "row": 25,
    "label": "註冊辦事處地址",
    "group": "企业地址",
    "source": "HK原字段",
    "note": "本地语言注册地址原文，Adyen无统一标准字段",
    "key": "註冊辦事處地址",
    "readonly": false
  },
  {
    "row": 26,
    "label": "註冊辦事處地址(英文)",
    "group": "企业地址",
    "source": "HK原字段",
    "note": "建议保留原始全文，并新增结构化地址字段",
    "key": "註冊辦事處地址(英文)",
    "readonly": false
  },
  {
    "row": 27,
    "label": "郵寄地址",
    "group": "企业地址",
    "source": "HK原字段",
    "note": "",
    "key": "郵寄地址",
    "readonly": false
  },
  {
    "row": 28,
    "label": "公司模式",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "",
    "key": "公司模式",
    "readonly": false
  },
  {
    "row": 29,
    "label": "是否子公司",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "",
    "key": "是否子公司",
    "readonly": false
  },
  {
    "row": 30,
    "label": "公司結構",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "",
    "key": "公司結構",
    "readonly": false
  },
  {
    "row": 31,
    "label": "企業架構文件",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "",
    "key": "企業架構文件",
    "readonly": false
  },
  {
    "row": 32,
    "label": "行業分類/業務性質/產品服務",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "现阶段先保留；从AFP语义更接近BL，后续建议迁出到BL对象",
    "key": "行業分類/業務性質/產品服務",
    "readonly": false
  },
  {
    "row": 33,
    "label": "行業分類/業務性質/產品服務",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "现阶段先保留；从AFP语义更接近BL，后续建议迁出到BL对象",
    "key": "行業分類/業務性質/產品服務__2",
    "readonly": false
  },
  {
    "row": 34,
    "label": "行業分類/業務性質/產品服務",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "现阶段先保留；从AFP语义更接近BL，后续建议迁出到BL对象",
    "key": "行業分類/業務性質/產品服務__3",
    "readonly": false
  },
  {
    "row": 35,
    "label": "MCC Code",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "CID保留主数据，同时对应BL行业/MCC",
    "key": "MCC Code",
    "readonly": false
  },
  {
    "row": 36,
    "label": "進階MCC Code",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "CID保留主数据，同时对应BL扩展行业设置",
    "key": "進階MCC Code",
    "readonly": false
  },
  {
    "row": 37,
    "label": "special MCC 附件",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "特殊MCC补充材料，正式归CID中的BL域",
    "key": "special MCC 附件",
    "readonly": false
  },
  {
    "row": 38,
    "label": "小微商戶",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "",
    "key": "小微商戶",
    "readonly": false
  },
  {
    "row": 39,
    "label": "SME 設定",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "",
    "key": "SME 設定",
    "readonly": false
  },
  {
    "row": 40,
    "label": "每宗交易平均金額",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "按地区规则可采集于CID或SID；CID保留企业层口径，SID可保留门店层口径",
    "key": "每宗交易平均金額",
    "readonly": false
  },
  {
    "row": 41,
    "label": "每宗交易最大交易額",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "按地区规则可采集于CID或SID；CID保留企业层口径，SID可保留门店层口径",
    "key": "每宗交易最大交易額",
    "readonly": false
  },
  {
    "row": 42,
    "label": "預計每年交易宗數",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "按地区规则可采集于CID或SID；CID保留企业层口径，SID可保留门店层口径",
    "key": "預計每年交易宗數",
    "readonly": false
  },
  {
    "row": 43,
    "label": "過往拒付比例",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "按地区规则可采集于CID或SID；CID保留企业层口径，SID可保留门店层口径",
    "key": "過往拒付比例",
    "readonly": false
  },
  {
    "row": 44,
    "label": "拒付平均處理日數",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "按地区规则可采集于CID或SID；CID保留企业层口径，SID可保留门店层口径",
    "key": "拒付平均處理日數",
    "readonly": false
  },
  {
    "row": 45,
    "label": "過往退款比例",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "按地区规则可采集于CID或SID；CID保留企业层口径，SID可保留门店层口径",
    "key": "過往退款比例",
    "readonly": false
  },
  {
    "row": 46,
    "label": "退款平均處理日數",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "按地区规则可采集于CID或SID；CID保留企业层口径，SID可保留门店层口径",
    "key": "退款平均處理日數",
    "readonly": false
  },
  {
    "row": 47,
    "label": "平均每月營業額",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "按地区规则可采集于CID或SID；CID保留企业层口径，SID可保留门店层口径",
    "key": "平均每月營業額",
    "readonly": false
  },
  {
    "row": 48,
    "label": "經營方式",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "按地区规则可采集于CID或SID；CID保留企业层口径，SID可保留门店层口径",
    "key": "經營方式",
    "readonly": false
  },
  {
    "row": 49,
    "label": "提前收款日數",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "按地区规则可采集于CID或SID；CID保留企业层口径，SID可保留门店层口径",
    "key": "提前收款日數",
    "readonly": false
  },
  {
    "row": 50,
    "label": "貨物/服務最短送達時間",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "按地区规则可采集于CID或SID；CID保留企业层口径，SID可保留门店层口径",
    "key": "貨物/服務最短送達時間",
    "readonly": false
  },
  {
    "row": 51,
    "label": "貨物/服務最長送達時間",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "按地区规则可采集于CID或SID；CID保留企业层口径，SID可保留门店层口径",
    "key": "貨物/服務最長送達時間",
    "readonly": false
  },
  {
    "row": 52,
    "label": "退貨政策",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "企业级政策/文件；归CID，默认不落AFP Store",
    "key": "退貨政策",
    "readonly": false
  },
  {
    "row": 53,
    "label": "退貨政策截圖",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "企业级政策/文件；归CID，默认不落AFP Store",
    "key": "退貨政策截圖",
    "readonly": false
  },
  {
    "row": 54,
    "label": "財務報表審計",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "业务线/经营能力相关资料，正式归CID中的BL域",
    "key": "財務報表審計",
    "readonly": false
  },
  {
    "row": 55,
    "label": "財務報表文件",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "业务线/经营能力相关资料，正式归CID中的BL域",
    "key": "財務報表文件",
    "readonly": false
  },
  {
    "row": 56,
    "label": "成立日期",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "企业成立日期",
    "key": "成立日期",
    "readonly": false
  },
  {
    "row": 57,
    "label": "經營年限",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "經營年限",
    "readonly": false
  },
  {
    "row": 58,
    "label": "法律地位",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "若现枚举能表达公司法律形态，可映射",
    "key": "法律地位",
    "readonly": false
  },
  {
    "row": 59,
    "label": "僱員人數",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "",
    "key": "僱員人數",
    "readonly": false
  },
  {
    "row": 60,
    "label": "注冊資本",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "",
    "key": "注冊資本",
    "readonly": false
  },
  {
    "row": 61,
    "label": "審核類型",
    "group": "风控/业务",
    "source": "HK原字段",
    "note": "",
    "key": "審核類型",
    "readonly": false
  },
  {
    "row": 62,
    "label": "上單來源",
    "group": "风控/业务",
    "source": "HK原字段",
    "note": "",
    "key": "上單來源",
    "readonly": false
  },
  {
    "row": 63,
    "label": "服務類型",
    "group": "风控/业务",
    "source": "HK原字段",
    "note": "",
    "key": "服務類型",
    "readonly": false
  },
  {
    "row": 64,
    "label": "合作夥伴推薦人",
    "group": "风控/业务",
    "source": "HK原字段",
    "note": "",
    "key": "合作夥伴推薦人",
    "readonly": false
  },
  {
    "row": 65,
    "label": "合作夥伴編號",
    "group": "风控/业务",
    "source": "HK原字段",
    "note": "",
    "key": "合作夥伴編號",
    "readonly": false
  },
  {
    "row": 66,
    "label": "交單備註",
    "group": "风控/业务",
    "source": "HK原字段",
    "note": "",
    "key": "交單備註",
    "readonly": false
  },
  {
    "row": 67,
    "label": "是否高額商戶",
    "group": "风控/业务",
    "source": "HK原字段",
    "note": "",
    "key": "是否高額商戶",
    "readonly": false
  },
  {
    "row": 68,
    "label": "公司電話",
    "group": "企业联系",
    "source": "HK原字段",
    "note": "也可部分复用为store.contactPhone",
    "key": "公司電話",
    "readonly": false
  },
  {
    "row": 69,
    "label": "職稱 / 職位",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "職稱 / 職位",
    "readonly": false
  },
  {
    "row": 70,
    "label": "手提電話",
    "group": "企业联系",
    "source": "HK原字段",
    "note": "",
    "key": "手提電話",
    "readonly": false
  },
  {
    "row": 71,
    "label": "電郵地址",
    "group": "企业地址",
    "source": "HK原字段",
    "note": "",
    "key": "電郵地址",
    "readonly": false
  },
  {
    "row": 72,
    "label": "管理員電郵",
    "group": "企业联系",
    "source": "HK原字段",
    "note": "建议作为企业主联系邮箱",
    "key": "管理員電郵",
    "readonly": false
  },
  {
    "row": 73,
    "label": "運營電郵",
    "group": "企业联系",
    "source": "HK原字段",
    "note": "",
    "key": "運營電郵",
    "readonly": false
  },
  {
    "row": 74,
    "label": "接收營銷資訊",
    "group": "企业联系",
    "source": "HK原字段",
    "note": "",
    "key": "接收營銷資訊",
    "readonly": false
  },
  {
    "row": 75,
    "label": "接收營銷資訊",
    "group": "企业联系",
    "source": "HK原字段",
    "note": "",
    "key": "接收營銷資訊__2",
    "readonly": false
  },
  {
    "row": 76,
    "label": "微信ID",
    "group": "企业联系",
    "source": "HK原字段",
    "note": "",
    "key": "微信ID",
    "readonly": false
  },
  {
    "row": 77,
    "label": "T1特選商戶",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "T1特選商戶",
    "readonly": false
  },
  {
    "row": 78,
    "label": "歸屬國編號",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "歸屬國編號",
    "readonly": false
  },
  {
    "row": 79,
    "label": "歸屬省編號",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "歸屬省編號",
    "readonly": false
  },
  {
    "row": 80,
    "label": "是否對公",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "是否對公",
    "readonly": false
  },
  {
    "row": 81,
    "label": "分行號",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "分行號",
    "readonly": false
  },
  {
    "row": 82,
    "label": "開戶費合計",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "開戶費合計",
    "readonly": false
  },
  {
    "row": 83,
    "label": "小費功能",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "小費功能",
    "readonly": false
  },
  {
    "row": 84,
    "label": "合約期",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "合約期",
    "readonly": false
  },
  {
    "row": 85,
    "label": "商業登記證號碼",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "HK场景关键企业注册号",
    "key": "商業登記證號碼",
    "readonly": false
  },
  {
    "row": 86,
    "label": "商業登記證名稱",
    "group": "企业名称",
    "source": "HK原字段",
    "note": "",
    "key": "商業登記證名稱",
    "readonly": false
  },
  {
    "row": 87,
    "label": "證書有效期",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "",
    "key": "證書有效期",
    "readonly": false
  },
  {
    "row": 88,
    "label": "商業登記證副本照片",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "",
    "key": "商業登記證副本照片",
    "readonly": false
  },
  {
    "row": 89,
    "label": "是否首次申請卡機商戶（包括KPay及其他卡機）",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "是否首次申請卡機商戶（包括KPay及其他卡機）",
    "readonly": false
  },
  {
    "row": 90,
    "label": "申請過的卡機品牌 （多選）",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "申請過的卡機品牌 （多選）",
    "readonly": false
  },
  {
    "row": 91,
    "label": "在上述卡機中，商戶預計使用KPay的業務占比",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "在上述卡機中，商戶預計使用KPay的業務占比",
    "readonly": false
  },
  {
    "row": 92,
    "label": "是否NGO",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "是否NGO",
    "readonly": false
  },
  {
    "row": 93,
    "label": "重複簽約原因",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "重複簽約原因",
    "readonly": false
  },
  {
    "row": 94,
    "label": "請提供重複簽約證明附件",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "",
    "key": "請提供重複簽約證明附件",
    "readonly": false
  },
  {
    "row": 95,
    "label": "商業登記冊內的資料的電子摘錄 (獨資經營者/合夥人適用)",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "",
    "key": "商業登記冊內的資料的電子摘錄 (獨資經營者/合夥人適用)",
    "readonly": false
  },
  {
    "row": 96,
    "label": "公司註冊証號碼(非必須)",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "公司註冊証號碼(非必須)",
    "readonly": false
  },
  {
    "row": 97,
    "label": "公司登記証名稱(非必須)",
    "group": "企业名称",
    "source": "HK原字段",
    "note": "",
    "key": "公司登記証名稱(非必須)",
    "readonly": false
  },
  {
    "row": 98,
    "label": "周年申報表有效期(非必須)",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "周年申報表有效期(非必須)",
    "readonly": false
  },
  {
    "row": 99,
    "label": "公司註冊證明書(非必須)",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "",
    "key": "公司註冊證明書(非必須)",
    "readonly": false
  },
  {
    "row": 100,
    "label": "公司章程大綱包括章程細則（如適用）(非必須)",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "公司章程大綱包括章程細則（如適用）(非必須)",
    "readonly": false
  },
  {
    "row": 101,
    "label": "周年申報表/法團成立表(非必須)",
    "group": "企业主体/经营",
    "source": "HK原字段",
    "note": "",
    "key": "周年申報表/法團成立表(非必須)",
    "readonly": false
  },
  {
    "row": 102,
    "label": "慈善機構資料",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "",
    "key": "慈善機構資料",
    "readonly": false
  },
  {
    "row": 103,
    "label": "教育資料",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "",
    "key": "教育資料",
    "readonly": false
  },
  {
    "row": 104,
    "label": "社團/協會資料",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "",
    "key": "社團/協會資料",
    "readonly": false
  },
  {
    "row": 105,
    "label": "業主立案法團資料",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "",
    "key": "業主立案法團資料",
    "readonly": false
  },
  {
    "row": 106,
    "label": "NP其他文檔",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "",
    "key": "NP其他文檔",
    "readonly": false
  },
  {
    "row": 107,
    "label": "LE类型（企业）",
    "group": "企业基础",
    "source": "AFP补充",
    "note": "标准字段，固定为 organization；建议作为企业LE类型主字段",
    "key": "LE类型（企业）",
    "readonly": true
  },
  {
    "row": 108,
    "label": "企业营业名称 / DBA",
    "group": "企业基础",
    "source": "AFP补充（结构化拆分）",
    "note": "若为企业营业名可映射；若明确是门店名则应落Store",
    "key": "企业营业名称 / DBA",
    "readonly": false
  },
  {
    "row": 109,
    "label": "企业描述",
    "group": "企业基础",
    "source": "AFP补充",
    "note": "建议新增；可选",
    "key": "企业描述",
    "readonly": true
  },
  {
    "row": 110,
    "label": "企业电话类型",
    "group": "企业基础",
    "source": "AFP补充",
    "note": "建议枚举：mobile / landline 等",
    "key": "企业电话类型",
    "readonly": true
  },
  {
    "row": 111,
    "label": "企业成立/适用法国家",
    "group": "企业主体/经营",
    "source": "AFP补充",
    "note": "HK场景建议默认/可选 HK",
    "key": "企业成立/适用法国家",
    "readonly": true
  },
  {
    "row": 112,
    "label": "注册地址（原始全文）",
    "group": "企业地址",
    "source": "AFP补充（结构化拆分）",
    "note": "现有是自由文本；建议保留原文并拆结构化",
    "key": "注册地址（原始全文）",
    "readonly": false
  },
  {
    "row": 113,
    "label": "注册地址-街道",
    "group": "企业地址",
    "source": "AFP补充",
    "note": "建议从 officeEnAddress 拆分",
    "key": "注册地址-街道",
    "readonly": true
  },
  {
    "row": 114,
    "label": "注册地址-补充地址",
    "group": "企业地址",
    "source": "AFP补充",
    "note": "",
    "key": "注册地址-补充地址",
    "readonly": true
  },
  {
    "row": 115,
    "label": "注册地址-城市",
    "group": "企业地址",
    "source": "AFP补充",
    "note": "",
    "key": "注册地址-城市",
    "readonly": true
  },
  {
    "row": 116,
    "label": "注册地址-州/省",
    "group": "企业地址",
    "source": "AFP补充",
    "note": "HK可为空",
    "key": "注册地址-州/省",
    "readonly": true
  },
  {
    "row": 117,
    "label": "主要营业地址（原始全文）",
    "group": "企业地址",
    "source": "AFP补充（结构化拆分）",
    "note": "现有是自由文本；建议拆结构化",
    "key": "主要营业地址（原始全文）",
    "readonly": false
  },
  {
    "row": 118,
    "label": "主要营业地址-城市",
    "group": "企业地址",
    "source": "AFP补充",
    "note": "",
    "key": "主要营业地址-城市",
    "readonly": true
  },
  {
    "row": 119,
    "label": "主要营业地址-州/省",
    "group": "企业地址",
    "source": "AFP补充",
    "note": "HK可为空",
    "key": "主要营业地址-州/省",
    "readonly": true
  },
  {
    "row": 120,
    "label": "企业税务国家",
    "group": "企业基础",
    "source": "AFP补充",
    "note": "建议至少支持多组",
    "key": "企业税务国家",
    "readonly": true
  },
  {
    "row": 121,
    "label": "企业税号",
    "group": "企业基础",
    "source": "AFP补充",
    "note": "若HK场景仅BR不足以替代税号，建议新增",
    "key": "企业税号",
    "readonly": true
  },
  {
    "row": 122,
    "label": "企业税号类型",
    "group": "企业基础",
    "source": "AFP补充",
    "note": "",
    "key": "企业税号类型",
    "readonly": true
  },
  {
    "row": 123,
    "label": "VAT号",
    "group": "企业基础",
    "source": "AFP补充",
    "note": "HK通常未必适用，但模型建议保留",
    "key": "VAT号",
    "readonly": true
  },
  {
    "row": 124,
    "label": "无VAT原因",
    "group": "企业基础",
    "source": "AFP补充",
    "note": "",
    "key": "无VAT原因",
    "readonly": true
  },
  {
    "row": 125,
    "label": "税务申报分类",
    "group": "企业基础",
    "source": "AFP补充",
    "note": "",
    "key": "税务申报分类",
    "readonly": true
  },
  {
    "row": 126,
    "label": "税务业务类型",
    "group": "企业基础",
    "source": "AFP补充",
    "note": "",
    "key": "税务业务类型",
    "readonly": true
  },
  {
    "row": 127,
    "label": "上市市场标识",
    "group": "企业基础",
    "source": "AFP补充",
    "note": "上市公司场景使用；HK表可选",
    "key": "上市市场标识",
    "readonly": true
  },
  {
    "row": 128,
    "label": "股票代码",
    "group": "企业基础",
    "source": "AFP补充",
    "note": "",
    "key": "股票代码",
    "readonly": true
  },
  {
    "row": 129,
    "label": "股票简称",
    "group": "企业基础",
    "source": "AFP补充",
    "note": "",
    "key": "股票简称",
    "readonly": true
  },
  {
    "row": 130,
    "label": "官网 / App Store URL",
    "group": "企业基础",
    "source": "AFP补充（结构化拆分）",
    "note": "Adyen字段只有一个webAddress；AFP侧仍建议Store层保留多链接",
    "key": "官网 / App Store URL",
    "readonly": false
  },
  {
    "row": 131,
    "label": "企业治理法律所在国",
    "group": "企业主体/经营",
    "source": "AFP补充",
    "note": "公司法适用国家/地区",
    "key": "企业治理法律所在国",
    "readonly": true
  },
  {
    "row": 132,
    "label": "企业税务申报分类",
    "group": "企业主体/经营",
    "source": "AFP补充",
    "note": "企业税务申报分类",
    "key": "企业税务申报分类",
    "readonly": true
  },
  {
    "row": 133,
    "label": "企业税务业务类型",
    "group": "企业主体/经营",
    "source": "AFP补充",
    "note": "企业税务业务类型",
    "key": "企业税务业务类型",
    "readonly": true
  },
  {
    "row": 134,
    "label": "上級公司ID",
    "group": "主键/关联",
    "source": "系统新增",
    "note": "用于识别集团/母子公司层级",
    "key": "上級公司ID",
    "readonly": true
  },
  {
    "row": 135,
    "label": "公司層級",
    "group": "企业主体/经营",
    "source": "系统新增",
    "note": "用于识别公司层级，例如1级/2级/3级",
    "key": "公司層級",
    "readonly": true
  },
  {
    "row": 136,
    "label": "业务线ID",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "Business Line 返回ID",
    "key": "业务线ID",
    "readonly": true
  },
  {
    "row": 137,
    "label": "业务线类型",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "例如 paymentProcessing",
    "key": "业务线类型",
    "readonly": true
  },
  {
    "row": 138,
    "label": "销售渠道",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "例如 online / pos / omni",
    "key": "销售渠道",
    "readonly": true
  },
  {
    "row": 139,
    "label": "资金流/清算模式",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "BL层资金流/清算模式",
    "key": "资金流/清算模式",
    "readonly": true
  },
  {
    "row": 140,
    "label": "账户持有人ID",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "Account Holder 返回ID",
    "key": "账户持有人ID",
    "readonly": true
  },
  {
    "row": 141,
    "label": "账户持有人关联LE ID",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "创建AH时引用的企业LE ID",
    "key": "账户持有人关联LE ID",
    "readonly": true
  },
  {
    "row": 142,
    "label": "账户持有人描述",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "Account Holder 描述",
    "key": "账户持有人描述",
    "readonly": true
  },
  {
    "row": 143,
    "label": "账户持有人参考号",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "Account Holder reference",
    "key": "账户持有人参考号",
    "readonly": true
  },
  {
    "row": 144,
    "label": "账户持有人状态",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "Account Holder 状态",
    "key": "账户持有人状态",
    "readonly": true
  },
  {
    "row": 145,
    "label": "商戶營業狀態(企業口徑)",
    "group": "企业基础",
    "source": "HK原字段",
    "note": "按你最新口径，CID与SID同时保留；用于部分地区按公司口径采集营业状态",
    "key": "商戶營業狀態(企業口徑)",
    "readonly": false
  },
  {
    "row": 146,
    "label": "入貨單",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "按你最新口径，CID与SID同时保留；用于部分地区按公司口径收集经营补件",
    "key": "入貨單",
    "readonly": false
  },
  {
    "row": 147,
    "label": "閉路電視錄影",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "按你最新口径，CID与SID同时保留；用于部分地区按公司口径收集经营补件",
    "key": "閉路電視錄影",
    "readonly": false
  },
  {
    "row": 148,
    "label": "最高交易金額的客戶單據",
    "group": "企业文件",
    "source": "HK原字段",
    "note": "按你最新口径，CID与SID同时保留；用于部分地区按公司口径收集经营补件",
    "key": "最高交易金額的客戶單據",
    "readonly": false
  },
  {
    "row": 149,
    "label": "注册地址-邮编",
    "group": "注册地址",
    "source": "AFP补充",
    "note": "AFP企业LE注册地址建议显性结构化补齐",
    "key": "注册地址-邮编",
    "readonly": true
  },
  {
    "row": 150,
    "label": "注册地址-国家",
    "group": "注册地址",
    "source": "AFP补充",
    "note": "AFP企业LE注册地址建议显性结构化补齐",
    "key": "注册地址-国家",
    "readonly": true
  },
  {
    "row": 151,
    "label": "主要营业地址-街道",
    "group": "主要营业地址",
    "source": "AFP补充",
    "note": "如果主要营业地址与注册地址不同，建议补齐结构化字段",
    "key": "主要营业地址-街道",
    "readonly": true
  },
  {
    "row": 152,
    "label": "主要营业地址-补充地址",
    "group": "主要营业地址",
    "source": "AFP补充",
    "note": "如果主要营业地址与注册地址不同，建议补齐结构化字段",
    "key": "主要营业地址-补充地址",
    "readonly": true
  },
  {
    "row": 153,
    "label": "主要营业地址-邮编",
    "group": "主要营业地址",
    "source": "AFP补充",
    "note": "如果主要营业地址与注册地址不同，建议补齐结构化字段",
    "key": "主要营业地址-邮编",
    "readonly": true
  },
  {
    "row": 154,
    "label": "主要营业地址-国家",
    "group": "主要营业地址",
    "source": "AFP补充",
    "note": "如果主要营业地址与注册地址不同，建议补齐结构化字段",
    "key": "主要营业地址-国家",
    "readonly": true
  },
  {
    "row": 155,
    "label": "企业电话类型",
    "group": "企业联系",
    "source": "AFP补充",
    "note": "LE电话类型；与organization.phone.number配套",
    "key": "企业电话类型__2",
    "readonly": true
  },
  {
    "row": 156,
    "label": "账户持有人地址-街道",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "如Account Holder独立维护联系地址，需显性留存；也可由企业地址派生",
    "key": "账户持有人地址-街道",
    "readonly": true
  },
  {
    "row": 157,
    "label": "账户持有人地址-门牌号",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "如Account Holder独立维护联系地址，需显性留存；也可由企业地址派生",
    "key": "账户持有人地址-门牌号",
    "readonly": true
  },
  {
    "row": 158,
    "label": "账户持有人地址-城市",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "如Account Holder独立维护联系地址，需显性留存；也可由企业地址派生",
    "key": "账户持有人地址-城市",
    "readonly": true
  },
  {
    "row": 159,
    "label": "账户持有人地址-州/省",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "美国/加拿大为强制；其他国家按规则",
    "key": "账户持有人地址-州/省",
    "readonly": true
  },
  {
    "row": 160,
    "label": "账户持有人地址-邮编",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "如Account Holder独立维护联系地址，需显性留存；也可由企业地址派生",
    "key": "账户持有人地址-邮编",
    "readonly": true
  },
  {
    "row": 161,
    "label": "账户持有人地址-国家",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "如Account Holder独立维护联系地址，需显性留存；也可由企业地址派生",
    "key": "账户持有人地址-国家",
    "readonly": true
  },
  {
    "row": 162,
    "label": "账户持有人邮箱",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "如Account Holder独立维护联系邮箱，需显性留存；也可由企业邮箱派生",
    "key": "账户持有人邮箱",
    "readonly": true
  },
  {
    "row": 163,
    "label": "账户持有人电话",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "如Account Holder独立维护联系电话，需显性留存；也可由企业电话派生",
    "key": "账户持有人电话",
    "readonly": true
  },
  {
    "row": 164,
    "label": "账户持有人电话类型",
    "group": "BL/AH",
    "source": "AFP补充",
    "note": "如Account Holder独立维护联系电话，需显性留存；也可由企业电话派生",
    "key": "账户持有人电话类型",
    "readonly": true
  }
];
