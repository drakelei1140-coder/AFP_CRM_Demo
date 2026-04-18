import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message
} from 'antd';
import type { FormInstance } from 'antd';
import { CopyOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEnterpriseStore } from '../store/enterpriseStore';

type FieldType = 'text' | 'textarea' | 'number' | 'percent' | 'date' | 'select' | 'boolean' | 'file' | 'readonly';

interface FieldConfig {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: string[];
  rules?: Array<Record<string, unknown>>;
}

const navItems = [
  ['overview', '企业概览'],
  ['keys', '企业主键与关联'],
  ['names', '企业名称信息'],
  ['operation', '企业主体与经营信息'],
  ['basic', '企业基础经营数据'],
  ['contact', '企业联系信息'],
  ['address', '企业地址信息'],
  ['file', '企业文件信息'],
  ['risk', '风控 / 业务信息'],
  ['shops', '关联商铺'],
  ['mids', '关联 MID']
] as const;

const read = (obj: Record<string, unknown> | undefined, key: string, fallback = '-') => {
  const value = obj?.[key];
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};

const boolToSwitch = (value: string) => ['true', '是', 'yes', '1', 'y'].includes((value || '').toLowerCase());

const enumOptions = {
  yesNo: ['是', '否'],
  companyMode: ['直营', '加盟', '连锁', '其他'],
  legalStatus: ['有限公司', '合伙企业', '独资企业', '其他'],
  riskLevel: ['低', '中', '高'],
  riskType: ['标准', '增强', '重点监控'],
  serviceType: ['收单', '分账', '综合'],
  reviewType: ['资料修改审核', '新建审核', '风险复核'],
  taxDeclare: ['一般纳税', '简易纳税', '免税'],
  taxBiz: ['本地销售', '跨境销售', '混合'],
  channel: ['Adyen-AFP', 'Adyen-payfac', 'Other'],
  phoneType: ['固定电话', '移动电话', '客服热线'],
  marketFlag: ['已上市', '未上市'],
  businessStatus: ['营业中', '停业中', '筹备中']
};

const topOverviewFields: FieldConfig[] = [
  { key: '企业编号', label: '企业编号', type: 'readonly' },
  { key: '地区', label: '地区', type: 'readonly' },
  { key: '企业启用状态', label: '企业启用状态', type: 'readonly' },
  { key: '企业审核状态', label: '企业审核状态', type: 'readonly' },
  { key: '服务通道', label: '服务通道', type: 'readonly' },
  { key: '上單來源', label: '上單來源', type: 'readonly' },
  { key: '创建人', label: '创建人', type: 'readonly' },
  { key: '创建时间', label: '创建时间', type: 'readonly' },
  { key: '更新时间', label: '更新时间', type: 'readonly' }
];

const sectionKeysFields: FieldConfig[] = [
  { key: '默认主联系人人员ID', label: '默认主联系人人员ID', required: true },
  { key: '上級公司ID', label: '上級公司ID', required: true }
];

const sectionNameFields: FieldConfig[] = [
  { key: '商戶中文名稱', label: '商戶中文名稱', required: true },
  { key: '商戶中文簡稱', label: '商戶中文簡稱' },
  { key: '商戶英文名稱', label: '商戶英文名稱', required: true },
  { key: '商戶英文簡稱', label: '商戶英文簡稱' },
  { key: '商戶其它名稱', label: '商戶其它名稱', type: 'textarea' },
  { key: '商戶所有名稱（中文）', label: '商戶所有名稱（中文）', type: 'textarea' },
  { key: '商戶所有名稱（英文）', label: '商戶所有名稱（英文）', type: 'textarea' },
  { key: '商業登記證名稱', label: '商業登記證名稱' },
  { key: '公司登記証名稱(非必須)', label: '公司登記証名稱(非必須)' }
];

const operationGroups: Array<{ title: string; fields: FieldConfig[] }> = [
  {
    title: '主体属性',
    fields: [
      { key: '公司模式', label: '公司模式', type: 'select', options: enumOptions.companyMode, required: true },
      { key: '是否子公司', label: '是否子公司', type: 'boolean' },
      { key: '公司結構', label: '公司結構' },
      { key: '小微商戶', label: '小微商戶', type: 'boolean' },
      { key: 'SME 設定', label: 'SME 設定', type: 'boolean' },
      { key: '公司層級', label: '公司層級' }
    ]
  },
  {
    title: '行业与经营分类',
    fields: [
      { key: '行業分類 / 業務性質 / 產品服務', label: '行業分類 / 業務性質 / 產品服務', type: 'textarea' },
      { key: 'MCC Code', label: 'MCC Code' },
      { key: '進階MCC Code', label: '進階MCC Code' },
      { key: 'special MCC 附件', label: 'special MCC 附件', type: 'file' }
    ]
  },
  {
    title: '税务与法务属性',
    fields: [
      { key: '成立日期', label: '成立日期', type: 'date' },
      { key: '法律地位', label: '法律地位', type: 'select', options: enumOptions.legalStatus },
      { key: '僱員人數', label: '僱員人數', type: 'number' },
      { key: '注冊資本', label: '注冊資本' },
      { key: '周年申報表 / 法團成立表(非必須)', label: '周年申報表 / 法團成立表(非必須)', type: 'file' },
      { key: '企业成立 / 适用法国家', label: '企业成立 / 适用法国家' },
      { key: '企业治理法律所在国', label: '企业治理法律所在国' },
      { key: '企业税务申报分类', label: '企业税务申报分类', type: 'select', options: enumOptions.taxDeclare },
      { key: '企业税务业务类型', label: '企业税务业务类型', type: 'select', options: enumOptions.taxBiz }
    ]
  }
];

const basicGroups: Array<{ title: string; fields: FieldConfig[] }> = [
  {
    title: '6.1 交易与经营指标',
    fields: [
      { key: '每宗交易平均金額', label: '每宗交易平均金額', type: 'number' },
      { key: '每宗交易最大交易額', label: '每宗交易最大交易額', type: 'number' },
      { key: '預計每年交易宗數', label: '預計每年交易宗數', type: 'number' },
      { key: '過往拒付比例', label: '過往拒付比例', type: 'percent' },
      { key: '拒付平均處理日數', label: '拒付平均處理日數', type: 'number' },
      { key: '過往退款比例', label: '過往退款比例', type: 'percent' },
      { key: '退款平均處理日數', label: '退款平均處理日數', type: 'number' },
      { key: '平均每月營業額', label: '平均每月營業額', type: 'number' },
      { key: '經營方式', label: '經營方式' },
      { key: '提前收款日數', label: '提前收款日數', type: 'number' },
      { key: '貨物 / 服務最短送達時間', label: '貨物 / 服務最短送達時間', type: 'number' },
      { key: '貨物 / 服務最長送達時間', label: '貨物 / 服務最長送達時間', type: 'number' },
      { key: '經營年限', label: '經營年限', type: 'number' }
    ]
  },
  {
    title: '6.2 合约与业务属性',
    fields: [
      { key: '進件通道(必須)', label: '進件通道(必須)', type: 'select', options: enumOptions.channel, required: true },
      { key: 'T1特選商戶', label: 'T1特選商戶', type: 'boolean' },
      { key: '是否對公', label: '是否對公', type: 'boolean' },
      { key: '小費功能', label: '小費功能', type: 'boolean' },
      { key: '合約期', label: '合約期' },
      { key: '是否首次申請卡機商戶（包括KPay及其他卡機）', label: '是否首次申請卡機商戶（包括KPay及其他卡機）', type: 'boolean' },
      { key: '申請過的卡機品牌（多選）', label: '申請過的卡機品牌（多選）', type: 'select', options: ['KPay', 'Verifone', 'PAX', 'Adyen'], rules: [], required: false },
      { key: '在上述卡機中，商戶預計使用KPay的業務占比', label: '在上述卡機中，商戶預計使用KPay的業務占比', type: 'percent' },
      { key: '是否NGO', label: '是否NGO', type: 'boolean' },
      { key: '重複簽約原因', label: '重複簽約原因', type: 'textarea' },
      { key: '商戶營業狀態（企業口徑）', label: '商戶營業狀態（企業口徑）', type: 'select', options: enumOptions.businessStatus }
    ]
  },
  {
    title: '6.3 税务与注册信息',
    fields: [
      { key: '企业税务国家', label: '企业税务国家' },
      { key: '企业税号', label: '企业税号' },
      { key: '企业税号类型', label: '企业税号类型' },
      { key: 'VAT号', label: 'VAT号' },
      { key: '无VAT原因', label: '无VAT原因' },
      { key: '税务申报分类', label: '税务申报分类', type: 'select', options: enumOptions.taxDeclare },
      { key: '税务业务类型', label: '税务业务类型', type: 'select', options: enumOptions.taxBiz },
      { key: '公司註冊証號碼(非必須)', label: '公司註冊証號碼(非必須)' },
      { key: '周年申報表有效期(非必須)', label: '周年申報表有效期(非必須)', type: 'date' }
    ]
  },
  {
    title: '6.4 上市与补充说明',
    fields: [
      { key: '上市市场标识', label: '上市市场标识', type: 'select', options: enumOptions.marketFlag },
      { key: '股票代码', label: '股票代码' },
      { key: '股票简称', label: '股票简称' },
      { key: '企业营业名称 / DBA', label: '企业营业名称 / DBA' },
      { key: '企业描述', label: '企业描述', type: 'textarea' },
      { key: '官网 / App Store URL', label: '官网 / App Store URL' },
      { key: '職稱 / 職位', label: '職稱 / 職位' },
      { key: '歸屬國編號', label: '歸屬國編號' },
      { key: '歸屬省編號', label: '歸屬省編號' },
      { key: '分行號', label: '分行號' },
      { key: '開戶費合計', label: '開戶費合計', type: 'number' },
      { key: '类型（企业）', label: '类型（企业）' }
    ]
  },
  {
    title: '6.5 附件与文档型字段',
    fields: [
      { key: '退貨政策', label: '退貨政策', type: 'textarea' },
      { key: '退貨政策截圖', label: '退貨政策截圖', type: 'file' },
      { key: '財務報表審計', label: '財務報表審計', type: 'file' },
      { key: 'NP其他文檔', label: 'NP其他文檔', type: 'file' },
      { key: '公司章程大綱包括章程細則（如適用）(非必須)', label: '公司章程大綱包括章程細則（如適用）(非必須)', type: 'file' }
    ]
  }
];

const contactFields: FieldConfig[] = [
  { key: '公司電話', label: '公司電話', rules: [{ pattern: /^[+\d\s-]{6,30}$/u, message: '请输入有效电话' }] },
  { key: '手提電話', label: '手提電話', rules: [{ pattern: /^[+\d\s-]{6,30}$/u, message: '请输入有效电话' }] },
  { key: '管理員電郵', label: '管理員電郵', rules: [{ type: 'email', message: '请输入有效邮箱' }] },
  { key: '運營電郵', label: '運營電郵', rules: [{ type: 'email', message: '请输入有效邮箱' }] },
  { key: '接收營銷資訊', label: '接收營銷資訊', type: 'boolean' },
  { key: '微信ID', label: '微信ID' },
  { key: '企业电话类型', label: '企业电话类型', type: 'select', options: enumOptions.phoneType }
];

const addressGroups: Array<{ title: string; fields: FieldConfig[] }> = [
  { title: '8.1 注册办事处地址', fields: [{ key: '註冊辦事處地址', label: '註冊辦事處地址' }, { key: '註冊辦事處地址(英文)', label: '註冊辦事處地址(英文)' }] },
  {
    title: '8.2 注册地址',
    fields: [
      { key: '注册地址（原始全文）', label: '注册地址（原始全文）', type: 'textarea' },
      { key: '注册地址-街道', label: '注册地址-街道' },
      { key: '注册地址-补充地址', label: '注册地址-补充地址' },
      { key: '注册地址-城市', label: '注册地址-城市' },
      { key: '注册地址-州 / 省', label: '注册地址-州 / 省' },
      { key: '注册地址-邮编', label: '注册地址-邮编' },
      { key: '注册地址-国家', label: '注册地址-国家' }
    ]
  },
  {
    title: '8.3 主要营业地址',
    fields: [
      { key: '主要营业地址（原始全文）', label: '主要营业地址（原始全文）', type: 'textarea' },
      { key: '主要营业地址-街道', label: '主要营业地址-街道' },
      { key: '主要营业地址-补充地址', label: '主要营业地址-补充地址' },
      { key: '主要营业地址-城市', label: '主要营业地址-城市' },
      { key: '主要营业地址-州 / 省', label: '主要营业地址-州 / 省' },
      { key: '主要营业地址-邮编', label: '主要营业地址-邮编' },
      { key: '主要营业地址-国家', label: '主要营业地址-国家' }
    ]
  },
  { title: '8.4 其他地址 / 联系', fields: [{ key: '郵寄地址', label: '郵寄地址' }, { key: '電郵地址', label: '電郵地址' }] }
];

const fileFields = [
  '商戶篩查報告',
  '企業架構文件',
  '財務報表文件',
  '商業登記證號碼',
  '證書有效期',
  '商業登記證副本照片',
  '請提供重複簽約證明附件',
  '商業登記冊內的資料的電子摘錄（獨資經營者 / 合夥人適用）',
  '公司註冊證明書(非必須)',
  '慈善機構資料',
  '教育資料',
  '社團 / 協會資料',
  '業主立案法團資料',
  '入貨單',
  '閉路電視錄影',
  '最高交易金額的客戶單據'
];

const riskGroups: Array<{ title: string; fields: FieldConfig[] }> = [
  {
    title: '风控信息',
    fields: [
      { key: '風控類型', label: '風控類型', type: 'select', options: enumOptions.riskType },
      { key: '風險等級', label: '風險等級', type: 'select', options: enumOptions.riskLevel },
      { key: '風險評估報告', label: '風險評估報告', type: 'file' },
      { key: '審核類型', label: '審核類型', type: 'select', options: enumOptions.reviewType }
    ]
  },
  {
    title: '业务协作信息',
    fields: [
      { key: '上單來源', label: '上單來源', type: 'readonly' },
      { key: '服務類型', label: '服務類型', type: 'select', options: enumOptions.serviceType },
      { key: '合作夥伴推薦人', label: '合作夥伴推薦人' },
      { key: '合作夥伴編號', label: '合作夥伴編號' },
      { key: '交單備註', label: '交單備註', type: 'textarea' },
      { key: '是否高額商戶', label: '是否高額商戶', type: 'boolean' }
    ]
  }
];

const getInitialValues = (ent: ReturnType<ReturnType<typeof useEnterpriseStore>['getEnterprise']>): Record<string, unknown> => {
  const source = {
    ...ent?.sections.keys,
    ...ent?.sections.names,
    ...ent?.sections.operation,
    ...ent?.sections.basic,
    ...ent?.sections.contact,
    ...ent?.sections.address,
    ...ent?.sections.file,
    ...ent?.sections.risk
  };

  const initialValues: Record<string, unknown> = {
    ...source,
    企业名称: ent?.name || '-',
    企业编号: ent?.cid || '-',
    地区: ent?.region || '-',
    企业启用状态: ent?.enableStatus || '-',
    企业审核状态: ent?.reviewStatus || '-',
    服务通道: ent?.channels.join(' / ') || '-',
    上單來源: ent?.source.join(' / ') || '-',
    创建人: ent?.creator || '-',
    创建时间: ent?.createdAt || '-',
    更新时间: ent?.updatedAt || '-',
    '行業分類 / 業務性質 / 產品服務': read(source, '行業分類 / 業務性質 / 產品服務', read(source, '行業分類/業務性質/產品服務')),
    '注册地址-州 / 省': read(source, '注册地址-州 / 省', read(source, '注册地址-州/省')),
    '主要营业地址-州 / 省': read(source, '主要营业地址-州 / 省', read(source, '主要营业地址-州/省')),
    企业描述: read(source, '企业描述', read(source, '企業描述')),
    创建时间临时: ent?.createdAt || '-'
  };

  const booleanFields = [
    '是否子公司',
    '小微商戶',
    'SME 設定',
    'T1特選商戶',
    '是否對公',
    '小費功能',
    '是否首次申請卡機商戶（包括KPay及其他卡機）',
    '是否NGO',
    '接收營銷資訊',
    '是否高額商戶'
  ];

  const dateFields = ['成立日期', '周年申報表有效期(非必須)'];

  booleanFields.forEach((field) => {
    initialValues[field] = boolToSwitch(String(initialValues[field] ?? ''));
  });

  dateFields.forEach((field) => {
    const value = String(initialValues[field] ?? '');
    initialValues[field] = value && value !== '-' ? dayjs(value) : null;
  });

  const brandsValue = initialValues['申請過的卡機品牌（多選）'];
  if (typeof brandsValue === 'string') {
    initialValues['申請過的卡機品牌（多選）'] = brandsValue
      .split(/[;,，、]/u)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return initialValues;
};

const FileInput = ({ value, onChange }: { value?: string; onChange?: (next: string) => void }) => (
  <Space.Compact style={{ width: '100%' }}>
    <Input value={value || ''} onChange={(event) => onChange?.(event.target.value)} placeholder="-" />
    <Button icon={<UploadOutlined />} onClick={() => message.info('Demo：文件上传入口已保留')}>
      上传
    </Button>
    <Button icon={<EyeOutlined />} onClick={() => message.info(value ? `Demo：查看 ${value}` : '暂无文件')}>
      查看
    </Button>
  </Space.Compact>
);

const renderFieldInput = (field: FieldConfig, form: FormInstance) => {
  switch (field.type) {
    case 'textarea':
      return <Input.TextArea rows={3} placeholder="-" />;
    case 'select':
      return <Select options={(field.options || []).map((value) => ({ value, label: value }))} mode={field.key === '申請過的卡機品牌（多選）' ? 'multiple' : undefined} placeholder="请选择" />;
    case 'boolean':
      return <Switch checkedChildren="是" unCheckedChildren="否" />;
    case 'date':
      return <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />;
    case 'file':
      return <FileInput />;
    case 'readonly':
      return <Typography.Text>{String(form.getFieldValue(field.key) || '-')}</Typography.Text>;
    default:
      return <Input placeholder="-" />;
  }
};

const rulesFor = (field: FieldConfig) => {
  const rules: Array<Record<string, unknown>> = [];
  if (field.required) rules.push({ required: true, message: `${field.label}为必填项` });
  if (field.type === 'number') rules.push({ pattern: /^\d+(\.\d+)?$/u, message: '请输入数值' });
  if (field.type === 'percent') rules.push({ pattern: /^\d+(\.\d+)?%?$/u, message: '请输入百分比格式' });
  if (field.type === 'date') {
    rules.push({
      validator: (_: unknown, value: unknown) => {
        if (!value) return Promise.resolve();
        return dayjs(value as string).isValid() ? Promise.resolve() : Promise.reject(new Error('日期格式无效'));
      }
    });
  }
  return [...rules, ...(field.rules || [])];
};

const renderFieldCol = (field: FieldConfig, form: FormInstance, colSpan = 8) => {
  if (field.type === 'readonly') {
    return (
      <Col span={colSpan} key={field.key}>
        <Form.Item name={field.key} label={field.label}>
          <Typography.Text>{String(form.getFieldValue(field.key) || '-')}</Typography.Text>
        </Form.Item>
      </Col>
    );
  }

  return (
    <Col span={colSpan} key={field.key}>
      <Form.Item
        label={field.label}
        name={field.key}
        valuePropName={field.type === 'boolean' ? 'checked' : 'value'}
        rules={rulesFor(field)}
      >
        {renderFieldInput(field, form)}
      </Form.Item>
    </Col>
  );
};

export const EnterpriseEditPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const store = useEnterpriseStore();
  const enterprise = store.getEnterprise(id);
  const [form] = Form.useForm();
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const targets = navItems.map(([key]) => document.getElementById(key)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current?.target?.id) setActiveSection(current.target.id);
      },
      { rootMargin: '-170px 0px -60% 0px', threshold: [0.1, 0.3, 0.6] }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [enterprise?.id]);

  if (!enterprise) return <Card>未找到企业</Card>;

  const initialValues = getInitialValues(enterprise);

  const submitDisabled =
    !Form.useWatch('企业名称', form) ||
    !Form.useWatch('默认主联系人人员ID', form) ||
    !Form.useWatch('上級公司ID', form) ||
    !Form.useWatch('商戶中文名稱', form) ||
    !Form.useWatch('商戶英文名稱', form) ||
    !Form.useWatch('進件通道(必須)', form);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={(values) => {
        const boolFields = [
          '是否子公司',
          '小微商戶',
          'SME 設定',
          'T1特選商戶',
          '是否對公',
          '小費功能',
          '是否首次申請卡機商戶（包括KPay及其他卡機）',
          '是否NGO',
          '接收營銷資訊',
          '是否高額商戶'
        ];
        const payload = {
          ...values,
          创建时间临时: undefined,
          成立日期: values.成立日期 ? dayjs(values.成立日期).format('YYYY-MM-DD') : '-',
          '周年申報表有效期(非必須)': values['周年申報表有效期(非必須)']
            ? dayjs(values['周年申報表有效期(非必須)']).format('YYYY-MM-DD')
            : '-'
        };
        boolFields.forEach((field) => {
          if (typeof payload[field] === 'boolean') {
            payload[field] = payload[field] ? '是' : '否';
          }
        });
        store.submitEditDraft(enterprise.id, payload);
        message.success('已提交修改，进入企业资料修改待审核流程（demo模拟）');
        navigate(`/enterprises/${enterprise.id}`);
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <Card id="overview" title="页面顶部基础信息区" style={{ marginBottom: 0 }}>
          <Row gutter={[16, 8]}>
            <Col span={8}>
              <Form.Item label="企业名称" name="企业名称" rules={[{ required: true, message: '企业名称为必填项' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="企业编号" name="企业编号">
                <Typography.Text copyable={{ text: enterprise.cid, icon: <CopyOutlined /> }}>{enterprise.cid || '-'}</Typography.Text>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="地区" name="地区">
                <Typography.Text>{enterprise.region || '-'}</Typography.Text>
              </Form.Item>
            </Col>
          </Row>

          <Descriptions
            bordered
            size="small"
            column={3}
            items={topOverviewFields.map((field) => ({
              key: field.key,
              label: field.label,
              children:
                field.label === '企业启用状态' ? (
                  <Tag style={{ background: '#f6efe3', color: '#5c3b12', borderColor: '#ecd7b2' }}>{enterprise.enableStatus || '-'}</Tag>
                ) : field.label === '企业审核状态' ? (
                  <Tag style={{ background: '#f6efe3', color: '#5c3b12', borderColor: '#ecd7b2' }}>{enterprise.reviewStatus || '-'}</Tag>
                ) : field.label === '企业编号' ? (
                  <Typography.Text copyable>{enterprise.cid}</Typography.Text>
                ) : field.label === '服务通道' ? (
                  enterprise.channels.join(' / ') || '-'
                ) : field.label === '上單來源' ? (
                  enterprise.source.join(' / ') || '-'
                ) : (
                  String(initialValues[field.key] || '-')
                )
            }))}
          />
        </Card>

        <div className="detail-section-nav-wrap detail-section-nav-sticky-strong">
          <div className="detail-section-nav">
            {navItems.map(([key, title]) => (
              <button
                type="button"
                key={key}
                className={`detail-section-nav-item ${activeSection === key ? 'active' : ''}`}
                onClick={() => document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        <Card id="keys" title="企业主键与关联信息区">
          <Row gutter={16}>{sectionKeysFields.map((field) => renderFieldCol(field, form))}</Row>
          <Typography.Text type="secondary">CID 已在顶部基础信息区展示；ID 类字段支持复制。</Typography.Text>
        </Card>

        <Card id="names" title="企业名称信息区">
          <Row gutter={16}>{sectionNameFields.map((field) => renderFieldCol(field, form, field.type === 'textarea' ? 12 : 8))}</Row>
        </Card>

        <Card id="operation" title="企业主体与经营信息区">
          {operationGroups.map((group, index) => (
            <div key={group.title}>
              <Typography.Title level={5} style={{ marginTop: index === 0 ? 0 : 8 }}>
                {group.title}
              </Typography.Title>
              <Row gutter={16}>{group.fields.map((field) => renderFieldCol(field, form, field.type === 'textarea' ? 12 : 8))}</Row>
              {index < operationGroups.length - 1 && <Divider />}
            </div>
          ))}
        </Card>

        <Card id="basic" title="企业基础经营数据区">
          {basicGroups.map((group, index) => (
            <div key={group.title}>
              <Typography.Title level={5} style={{ marginTop: index === 0 ? 0 : 8 }}>
                {group.title}
              </Typography.Title>
              <Row gutter={16}>{group.fields.map((field) => renderFieldCol(field, form, field.type === 'textarea' ? 24 : 8))}</Row>
              {index < basicGroups.length - 1 && <Divider />}
            </div>
          ))}
        </Card>

        <Card id="contact" title="企业联系信息区">
          <Row gutter={16}>{contactFields.map((field) => renderFieldCol(field, form))}</Row>
        </Card>

        <Card id="address" title="企业地址信息区">
          {addressGroups.map((group, index) => (
            <div key={group.title}>
              <Typography.Title level={5} style={{ marginTop: index === 0 ? 0 : 8 }}>
                {group.title}
              </Typography.Title>
              <Row gutter={16}>{group.fields.map((field) => renderFieldCol(field, form, field.type === 'textarea' ? 24 : 8))}</Row>
              {index < addressGroups.length - 1 && <Divider />}
            </div>
          ))}
        </Card>

        <Card id="file" title="企业文件信息区">
          <Table
            rowKey="field"
            pagination={false}
            dataSource={fileFields.map((field) => ({ field, value: String(form.getFieldValue(field) || initialValues[field] || '-') }))}
            columns={[
              { title: '字段名', dataIndex: 'field', width: '34%' },
              {
                title: '文件 / 内容',
                dataIndex: 'value',
                render: (value: string, record: { field: string }) => (
                  <Space.Compact style={{ width: '100%' }}>
                    <Form.Item name={record.field} style={{ marginBottom: 0, flex: 1 }}>
                      <Input placeholder="-" />
                    </Form.Item>
                    <Button icon={<UploadOutlined />} onClick={() => message.info(`Demo：上传 ${record.field}`)}>上传</Button>
                    <Button icon={<EyeOutlined />} onClick={() => message.info(value && value !== '-' ? `Demo：查看 ${value}` : '暂无文件')}>查看</Button>
                  </Space.Compact>
                )
              }
            ]}
          />
        </Card>

        <Card id="risk" title="风控 / 业务信息区">
          {riskGroups.map((group, index) => (
            <div key={group.title}>
              <Typography.Title level={5} style={{ marginTop: index === 0 ? 0 : 8 }}>{group.title}</Typography.Title>
              <Row gutter={16}>{group.fields.map((field) => renderFieldCol(field, form, field.type === 'textarea' ? 24 : 8))}</Row>
              {index < riskGroups.length - 1 && <Divider />}
            </div>
          ))}
        </Card>

        <Card id="shops" title="关联商铺信息展示区">
          <Alert
            style={{ marginBottom: 12 }}
            type="info"
            showIcon
            message="关联商铺不可在本页编辑，仅支持查看详情。"
          />
          <Table
            rowKey="id"
            pagination={false}
            dataSource={enterprise.shops}
            columns={[
              { title: '商铺名称', dataIndex: 'name' },
              { title: '商铺编号', dataIndex: 'id', render: (value: string) => <Typography.Text copyable>{value}</Typography.Text> },
              { title: '地区', dataIndex: 'region' },
              { title: '启用状态', dataIndex: 'enableStatus', render: (value: string) => <Tag style={{ background: '#f6efe3', color: '#5c3b12', borderColor: '#ecd7b2' }}>{value || '-'}</Tag> },
              { title: '审核状态', dataIndex: 'reviewStatus', render: (value: string) => <Tag style={{ background: '#f6efe3', color: '#5c3b12', borderColor: '#ecd7b2' }}>{value || '-'}</Tag> },
              { title: '操作', render: () => <Button type="link">查看详情</Button> }
            ]}
          />
        </Card>

        <Card id="mids" title="关联 MID 信息展示区">
          <Alert
            style={{ marginBottom: 12 }}
            type="info"
            showIcon
            message="关联 MID 不可在本页编辑，仅支持查看详情。"
          />
          <Table
            rowKey="id"
            pagination={false}
            dataSource={enterprise.mids}
            columns={[
              { title: 'MID 编号', dataIndex: 'id', render: (value: string) => <Typography.Text copyable>{value}</Typography.Text> },
              { title: '所属商铺', dataIndex: 'shopName' },
              { title: '服务通道', dataIndex: 'channel' },
              { title: '当前状态', dataIndex: 'status' },
              { title: '更新时间', dataIndex: 'updatedAt' },
              { title: '操作', render: () => <Button type="link">查看详情</Button> }
            ]}
          />
        </Card>

        <div className="sticky-bottom-actions" style={{ zIndex: 30 }}>
          <Space>
            <Button onClick={() => navigate(-1)}>取消</Button>
            <Button type="primary" htmlType="submit" disabled={Boolean(submitDisabled)}>
              提交修改
            </Button>
          </Space>
        </div>

        <Alert message="提交后仅生成“企业资料修改待审核”记录，不直接覆盖正式生效数据（demo模拟）。" type="info" showIcon />
      </Space>
    </Form>
  );
};
