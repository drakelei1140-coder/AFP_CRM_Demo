import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
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
  Upload,
  message
} from 'antd';
import { CopyOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EnableTag, ReviewTag } from '../components/StatusTag';
import { useEnterpriseStore } from '../store/enterpriseStore';

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

const enumOptions = {
  yesNo: [{ value: '是' }, { value: '否' }],
  companyMode: [{ value: '直营' }, { value: '加盟' }, { value: '连锁' }, { value: '其他' }],
  legalStatus: [{ value: '个人' }, { value: '个体工商户' }, { value: '有限公司' }, { value: '股份有限公司' }, { value: '合伙企业' }, { value: '非营利组织' }, { value: '其他' }],
  source: [{ value: 'CRM' }, { value: 'DMO' }, { value: 'SaaS' }, { value: 'Other' }],
  channel: [{ value: 'Adyen-AFP' }, { value: 'Adyen-payfac' }, { value: 'Other' }],
  phoneType: [{ value: '座机' }, { value: '手机' }, { value: '400热线' }, { value: '其他' }],
  riskLevel: [{ value: '低' }, { value: '中' }, { value: '高' }],
  riskType: [{ value: '标准' }, { value: '增强' }, { value: '简化' }],
  reviewType: [{ value: '新建审核' }, { value: '资料修改审核' }, { value: '复审' }],
  serviceType: [{ value: '收单' }, { value: '聚合收款' }, { value: '跨境' }],
  market: [{ value: 'HKEX' }, { value: 'NYSE' }, { value: 'NASDAQ' }, { value: '未上市' }]
};

const numericRule = { pattern: /^-?\d+(\.\d+)?$/, message: '请输入有效数值' };
const percentRule = { pattern: /^\d+(\.\d+)?%?$/, message: '请输入百分比格式' };

export const EnterpriseEditPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const store = useEnterpriseStore();
  const ent = store.getEnterprise(id);
  const [form] = Form.useForm();
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [canSubmit, setCanSubmit] = useState(false);

  const sourceMap = useMemo(() => {
    if (!ent) return {} as Record<string, string | number | undefined | null>;
    return {
      ...ent.overview,
      ...ent.sections.keys,
      ...ent.sections.names,
      ...ent.sections.operation,
      ...ent.sections.basic,
      ...ent.sections.contact,
      ...ent.sections.address,
      ...ent.sections.file,
      ...ent.sections.risk,
      企业名称: ent.name,
      企业编号: ent.cid,
      地区: ent.region,
      服务通道: ent.channels.join(' / '),
      上單來源: ent.source.join(' / '),
      创建人: ent.creator,
      创建时间: ent.createdAt,
      更新时间: ent.updatedAt,
      企业审核状态: ent.reviewStatus,
      企业启用状态: ent.enableStatus || '-',
      '行業分類 / 業務性質 / 產品服務': ent.sections.operation['行業分類/業務性質/產品服務'],
      企业描述: ent.sections.basic['企業描述']
    };
  }, [ent]);

  const pick = (field: string, aliases: string[] = []) => {
    const values = [field, ...aliases].map((key) => sourceMap[key]).find((value) => value !== undefined && value !== null && value !== '');
    return values === undefined || values === null || values === '' ? '' : String(values);
  };

  const initialValues = useMemo(() => {
    if (!ent) return {};
    return {
      企业名称: ent.name,
      默认主联系人人员ID: pick('默认主联系人人员ID'),
      上級公司ID: pick('上級公司ID'),
      商戶中文名稱: pick('商戶中文名稱'),
      商戶中文簡稱: pick('商戶中文簡稱'),
      商戶英文名稱: pick('商戶英文名稱'),
      商戶英文簡稱: pick('商戶英文簡稱'),
      商戶其它名稱: pick('商戶其它名稱'),
      '商戶所有名稱（中文）': pick('商戶所有名稱（中文）'),
      '商戶所有名稱（英文）': pick('商戶所有名稱（英文）'),
      商業登記證名稱: pick('商業登記證名稱'),
      '公司登記証名稱(非必須)': pick('公司登記証名稱(非必須)'),
      公司模式: pick('公司模式'),
      是否子公司: pick('是否子公司'),
      公司結構: pick('公司結構'),
      '行業分類 / 業務性質 / 產品服務': pick('行業分類 / 業務性質 / 產品服務', ['行業分類/業務性質/產品服務']),
      'MCC Code': pick('MCC Code'),
      '進階MCC Code': pick('進階MCC Code'),
      'special MCC 附件': pick('special MCC 附件'),
      小微商戶: pick('小微商戶'),
      'SME 設定': pick('SME 設定'),
      成立日期: pick('成立日期') ? dayjs(pick('成立日期')) : null,
      法律地位: pick('法律地位'),
      僱員人數: pick('僱員人數'),
      注冊資本: pick('注冊資本'),
      '周年申報表 / 法團成立表(非必須)': pick('周年申報表 / 法團成立表(非必須)'),
      '企业成立 / 适用法国家': pick('企业成立 / 适用法国家'),
      企业治理法律所在国: pick('企业治理法律所在国'),
      企业税务申报分类: pick('企业税务申报分类'),
      企业税务业务类型: pick('企业税务业务类型'),
      公司層級: pick('公司層級'),
      '進件通道(必須)': ent.channels,
      每宗交易平均金額: pick('每宗交易平均金額'),
      每宗交易最大交易額: pick('每宗交易最大交易額'),
      預計每年交易宗數: pick('預計每年交易宗數'),
      過往拒付比例: pick('過往拒付比例'),
      拒付平均處理日數: pick('拒付平均處理日數'),
      過往退款比例: pick('過往退款比例'),
      退款平均處理日數: pick('退款平均處理日數'),
      平均每月營業額: pick('平均每月營業額'),
      經營方式: pick('經營方式'),
      提前收款日數: pick('提前收款日數'),
      '貨物 / 服務最短送達時間': pick('貨物 / 服務最短送達時間'),
      '貨物 / 服務最長送達時間': pick('貨物 / 服務最長送達時間'),
      退貨政策: pick('退貨政策'),
      退貨政策截圖: pick('退貨政策截圖'),
      財務報表審計: pick('財務報表審計'),
      經營年限: pick('經營年限'),
      '職稱 / 職位': pick('職稱 / 職位'),
      T1特選商戶: pick('T1特選商戶'),
      歸屬國編號: pick('歸屬國編號'),
      歸屬省編號: pick('歸屬省編號'),
      是否對公: pick('是否對公'),
      分行號: pick('分行號'),
      開戶費合計: pick('開戶費合計'),
      小費功能: pick('小費功能'),
      合約期: pick('合約期'),
      '是否首次申請卡機商戶（包括KPay及其他卡機）': pick('是否首次申請卡機商戶（包括KPay及其他卡機）'),
      '申請過的卡機品牌（多選）': pick('申請過的卡機品牌（多選）') ? pick('申請過的卡機品牌（多選）').split(/[;,，]/).filter(Boolean) : [],
      '在上述卡機中，商戶預計使用KPay的業務占比': pick('在上述卡機中，商戶預計使用KPay的業務占比'),
      是否NGO: pick('是否NGO'),
      重複簽約原因: pick('重複簽約原因'),
      '公司註冊証號碼(非必須)': pick('公司註冊証號碼(非必須)'),
      '周年申報表有效期(非必須)': pick('周年申報表有效期(非必須)'),
      '公司章程大綱包括章程細則（如適用）(非必須)': pick('公司章程大綱包括章程細則（如適用）(非必須)'),
      NP其他文檔: pick('NP其他文檔'),
      '类型（企业）': pick('类型（企业）'),
      '企业营业名称 / DBA': pick('企业营业名称 / DBA'),
      企业描述: pick('企业描述', ['企業描述']),
      企业税务国家: pick('企业税务国家'),
      企业税号: pick('企业税号'),
      企业税号类型: pick('企业税号类型'),
      VAT号: pick('VAT号'),
      无VAT原因: pick('无VAT原因'),
      税务申报分类: pick('税务申报分类'),
      税务业务类型: pick('税务业务类型'),
      上市市场标识: pick('上市市场标识'),
      股票代码: pick('股票代码'),
      股票简称: pick('股票简称'),
      '官网 / App Store URL': pick('官网 / App Store URL'),
      '商戶營業狀態（企業口徑）': pick('商戶營業狀態（企業口徑）'),
      公司電話: pick('公司電話'),
      手提電話: pick('手提電話'),
      管理員電郵: pick('管理員電郵'),
      運營電郵: pick('運營電郵'),
      接收營銷資訊: pick('接收營銷資訊') === '是',
      微信ID: pick('微信ID'),
      企业电话类型: pick('企业电话类型'),
      註冊辦事處地址: pick('註冊辦事處地址'),
      '註冊辦事處地址(英文)': pick('註冊辦事處地址(英文)'),
      郵寄地址: pick('郵寄地址'),
      電郵地址: pick('電郵地址'),
      '注册地址（原始全文）': pick('注册地址（原始全文）'),
      '注册地址-街道': pick('注册地址-街道'),
      '注册地址-补充地址': pick('注册地址-补充地址'),
      '注册地址-城市': pick('注册地址-城市'),
      '注册地址-州 / 省': pick('注册地址-州 / 省', ['注册地址-州/省']),
      '注册地址-邮编': pick('注册地址-邮编'),
      '注册地址-国家': pick('注册地址-国家'),
      '主要营业地址（原始全文）': pick('主要营业地址（原始全文）'),
      '主要营业地址-街道': pick('主要营业地址-街道'),
      '主要营业地址-补充地址': pick('主要营业地址-补充地址'),
      '主要营业地址-城市': pick('主要营业地址-城市'),
      '主要营业地址-州 / 省': pick('主要营业地址-州 / 省', ['主要营业地址-州/省']),
      '主要营业地址-邮编': pick('主要营业地址-邮编'),
      '主要营业地址-国家': pick('主要营业地址-国家'),
      商戶篩查報告: pick('商戶篩查報告'),
      企業架構文件: pick('企業架構文件'),
      財務報表文件: pick('財務報表文件'),
      商業登記證號碼: pick('商業登記證號碼'),
      證書有效期: pick('證書有效期'),
      商業登記證副本照片: pick('商業登記證副本照片'),
      請提供重複簽約證明附件: pick('請提供重複簽約證明附件'),
      '商業登記冊內的資料的電子摘錄（獨資經營者 / 合夥人適用）': pick('商業登記冊內的資料的電子摘錄（獨資經營者 / 合夥人適用）'),
      '公司註冊證明書(非必須)': pick('公司註冊證明書(非必須)'),
      慈善機構資料: pick('慈善機構資料'),
      教育資料: pick('教育資料'),
      '社團 / 協會資料': pick('社團 / 協會資料'),
      業主立案法團資料: pick('業主立案法團資料'),
      入貨單: pick('入貨單'),
      閉路電視錄影: pick('閉路電視錄影'),
      最高交易金額的客戶單據: pick('最高交易金額的客戶單據'),
      風控類型: pick('風控類型'),
      風險等級: pick('風險等級'),
      風險評估報告: pick('風險評估報告'),
      審核類型: pick('審核類型'),
      服務類型: pick('服務類型'),
      合作夥伴推薦人: pick('合作夥伴推薦人'),
      合作夥伴編號: pick('合作夥伴編號'),
      交單備註: pick('交單備註'),
      是否高額商戶: pick('是否高額商戶')
    };
  }, [ent, pick]);

  useEffect(() => {
    const nodes = navItems.map(([k]) => document.getElementById(k)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current?.target?.id) setActiveSection(current.target.id);
    }, { rootMargin: '-140px 0px -68% 0px', threshold: [0.1, 0.25, 0.5, 0.8] });

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ent?.id]);

  const validateSubmit = async () => {
    try {
      await form.validateFields({ validateOnly: true });
      setCanSubmit(true);
    } catch {
      setCanSubmit(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
    validateSubmit();
  }, [form, initialValues]);

  if (!ent) return <Card>未找到企业</Card>;

  const readOnlyText = (value?: string | null) => (value && value.trim() ? value : '-');

  const fileFieldTable = [
    '商戶篩查報告', '企業架構文件', '財務報表文件', '商業登記證副本照片', '請提供重複簽約證明附件',
    '商業登記冊內的資料的電子摘錄（獨資經營者 / 合夥人適用）', '公司註冊證明書(非必須)', '慈善機構資料',
    '教育資料', '社團 / 協會資料', '業主立案法團資料', '入貨單', '閉路電視錄影', '最高交易金額的客戶單據'
  ];

  return (
    <div style={{ width: '100%' }}>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={() => validateSubmit()}
        onFinish={(values) => {
          const payload = {
            ...values,
            成立日期: values.成立日期 ? dayjs(values.成立日期).format('YYYY-MM-DD') : '',
            接收營銷資訊: values.接收營銷資訊 ? '是' : '否',
            '進件通道(必須)': (values['進件通道(必須)'] || []).join(' / '),
            '申請過的卡機品牌（多選）': (values['申請過的卡機品牌（多選）'] || []).join(', ')
          };
          store.submitEditDraft(ent.id, payload);
          message.success('已进入企业资料修改待审核流程（demo模拟）');
          navigate(`/enterprises/${ent.id}`);
        }}
      >
        <Card id="overview" title="页面顶部基础信息区" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 8]}>
            <Col span={8}>
              <Form.Item label="企业名称" name="企业名称" rules={[{ required: true, message: '请输入企业名称' }]}>
                <Input placeholder="请输入企业名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Typography.Text type="secondary">企业编号</Typography.Text>
              <div><Typography.Text copyable={{ icon: <CopyOutlined /> }}>{ent.cid}</Typography.Text></div>
            </Col>
            <Col span={8}>
              <Typography.Text type="secondary">地区</Typography.Text>
              <div>{readOnlyText(ent.region)}</div>
            </Col>
            <Col span={8}>
              <Typography.Text type="secondary">企业启用状态</Typography.Text>
              <div><EnableTag status={ent.enableStatus} /></div>
            </Col>
            <Col span={8}>
              <Typography.Text type="secondary">企业审核状态</Typography.Text>
              <div><ReviewTag status={ent.reviewStatus} /></div>
            </Col>
            <Col span={8}>
              <Typography.Text type="secondary">服务通道</Typography.Text>
              <div>{readOnlyText(ent.channels.join(' / '))}</div>
            </Col>
            <Col span={8}><Typography.Text type="secondary">上單來源</Typography.Text><div>{readOnlyText(ent.source.join(' / '))}</div></Col>
            <Col span={8}><Typography.Text type="secondary">创建人</Typography.Text><div>{readOnlyText(ent.creator)}</div></Col>
            <Col span={8}><Typography.Text type="secondary">创建时间</Typography.Text><div>{readOnlyText(ent.createdAt)}</div></Col>
            <Col span={8}><Typography.Text type="secondary">更新时间</Typography.Text><div>{readOnlyText(ent.updatedAt)}</div></Col>
          </Row>
        </Card>

        <Card title="顶部悬浮导航标签区" style={{ marginBottom: 16, position: 'sticky', top: 0, zIndex: 40 }}>
          <div className="detail-section-nav-wrap" style={{ top: 0, padding: 0 }}>
            <div className="detail-section-nav">
              {navItems.map(([key, title]) => (
                <button
                  key={key}
                  type="button"
                  className={`detail-section-nav-item ${activeSection === key ? 'active' : ''}`}
                  onClick={() => document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card id="keys" title="企业主键与关联信息区" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="默认主联系人人员ID" name="默认主联系人人员ID" rules={[{ required: true, message: '请输入默认主联系人人员ID' }]}>
                <Input suffix={<Typography.Text copyable={{ text: form.getFieldValue('默认主联系人人员ID') || '' }} />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="上級公司ID" name="上級公司ID" rules={[{ required: true, message: '请输入上級公司ID' }]}>
                <Input suffix={<Typography.Text copyable={{ text: form.getFieldValue('上級公司ID') || '' }} />} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card id="names" title="企业名称信息区" style={{ marginBottom: 16 }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>中文名称组</Typography.Title>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="商戶中文名稱" name="商戶中文名稱" rules={[{ required: true, message: '请输入商戶中文名稱' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="商戶中文簡稱" name="商戶中文簡稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="商戶所有名稱（中文）" name="商戶所有名稱（中文）"><Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} /></Form.Item></Col>
          </Row>
          <Divider />
          <Typography.Title level={5}>英文与其他名称组</Typography.Title>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="商戶英文名稱" name="商戶英文名稱" rules={[{ required: true, message: '请输入商戶英文名稱' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="商戶英文簡稱" name="商戶英文簡稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="商戶其它名稱" name="商戶其它名稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="商戶所有名稱（英文）" name="商戶所有名稱（英文）"><Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} /></Form.Item></Col>
            <Col span={8}><Form.Item label="商業登記證名稱" name="商業登記證名稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="公司登記証名稱(非必須)" name="公司登記証名稱(非必須)"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card id="operation" title="企业主体与经营信息区" style={{ marginBottom: 16 }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>主体属性</Typography.Title>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="公司模式" name="公司模式" rules={[{ required: true, message: '请选择公司模式' }]}><Select options={enumOptions.companyMode} /></Form.Item></Col>
            <Col span={8}><Form.Item label="是否子公司" name="是否子公司"><Select options={enumOptions.yesNo} /></Form.Item></Col>
            <Col span={8}><Form.Item label="公司結構" name="公司結構"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="小微商戶" name="小微商戶"><Select options={enumOptions.yesNo} /></Form.Item></Col>
            <Col span={8}><Form.Item label="SME 設定" name="SME 設定"><Select options={enumOptions.yesNo} /></Form.Item></Col>
            <Col span={8}><Form.Item label="公司層級" name="公司層級"><Input /></Form.Item></Col>
          </Row>
          <Divider />
          <Typography.Title level={5}>行业与经营分类</Typography.Title>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="行業分類 / 業務性質 / 產品服務" name="行業分類 / 業務性質 / 產品服務"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="MCC Code" name="MCC Code"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="進階MCC Code" name="進階MCC Code"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="special MCC 附件" name="special MCC 附件"><Input /></Form.Item></Col>
          </Row>
          <Divider />
          <Typography.Title level={5}>税务与法务属性</Typography.Title>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="成立日期" name="成立日期"><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" /></Form.Item></Col>
            <Col span={8}><Form.Item label="法律地位" name="法律地位"><Select options={enumOptions.legalStatus} /></Form.Item></Col>
            <Col span={8}><Form.Item label="僱員人數" name="僱員人數" rules={[numericRule]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="注冊資本" name="注冊資本"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="周年申報表 / 法團成立表(非必須)" name="周年申報表 / 法團成立表(非必須)"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="企业成立 / 适用法国家" name="企业成立 / 适用法国家"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="企业治理法律所在国" name="企业治理法律所在国"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="企业税务申报分类" name="企业税务申报分类"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="企业税务业务类型" name="企业税务业务类型"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card id="basic" title="企业基础经营数据区" style={{ marginBottom: 16 }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>6.1 交易与经营指标</Typography.Title>
          <Row gutter={16}>
            {['每宗交易平均金額', '每宗交易最大交易額', '預計每年交易宗數', '過往拒付比例', '拒付平均處理日數', '過往退款比例', '退款平均處理日數', '平均每月營業額', '經營方式', '提前收款日數', '貨物 / 服務最短送達時間', '貨物 / 服務最長送達時間', '經營年限'].map((field) => (
              <Col span={8} key={field}><Form.Item label={field} name={field} rules={field.includes('比例') ? [percentRule] : undefined}><Input /></Form.Item></Col>
            ))}
          </Row>
          <Divider />
          <Typography.Title level={5}>6.2 合约与业务属性</Typography.Title>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="進件通道(必須)" name="進件通道(必須)" rules={[{ required: true, message: '请选择進件通道(必須)' }]}><Select mode="multiple" options={enumOptions.channel} /></Form.Item></Col>
            <Col span={8}><Form.Item label="T1特選商戶" name="T1特選商戶"><Select options={enumOptions.yesNo} /></Form.Item></Col>
            <Col span={8}><Form.Item label="是否對公" name="是否對公"><Select options={enumOptions.yesNo} /></Form.Item></Col>
            <Col span={8}><Form.Item label="小費功能" name="小費功能"><Select options={enumOptions.yesNo} /></Form.Item></Col>
            <Col span={8}><Form.Item label="合約期" name="合約期"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="是否首次申請卡機商戶（包括KPay及其他卡機）" name="是否首次申請卡機商戶（包括KPay及其他卡機）"><Select options={enumOptions.yesNo} /></Form.Item></Col>
            <Col span={8}><Form.Item label="申請過的卡機品牌（多選）" name="申請過的卡機品牌（多選）"><Select mode="multiple" options={[{ value: 'KPay' }, { value: 'Adyen' }, { value: 'Stripe' }, { value: '其他' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="在上述卡機中，商戶預計使用KPay的業務占比" name="在上述卡機中，商戶預計使用KPay的業務占比" rules={[percentRule]}><Input placeholder="例如 60%" /></Form.Item></Col>
            <Col span={8}><Form.Item label="是否NGO" name="是否NGO"><Select options={enumOptions.yesNo} /></Form.Item></Col>
            <Col span={8}><Form.Item label="重複簽約原因" name="重複簽約原因"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="商戶營業狀態（企業口徑）" name="商戶營業狀態（企業口徑）"><Input /></Form.Item></Col>
          </Row>
          <Divider />
          <Typography.Title level={5}>6.3 税务与注册信息</Typography.Title>
          <Row gutter={16}>
            {['企业税务国家', '企业税号', '企业税号类型', 'VAT号', '无VAT原因', '税务申报分类', '税务业务类型', '公司註冊証號碼(非必須)', '周年申報表有效期(非必須)'].map((field) => (
              <Col span={8} key={field}><Form.Item label={field} name={field}><Input /></Form.Item></Col>
            ))}
          </Row>
          <Divider />
          <Typography.Title level={5}>6.4 上市与补充说明</Typography.Title>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="上市市场标识" name="上市市场标识"><Select options={enumOptions.market} /></Form.Item></Col>
            <Col span={8}><Form.Item label="股票代码" name="股票代码"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="股票简称" name="股票简称"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="企业营业名称 / DBA" name="企业营业名称 / DBA"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="官网 / App Store URL" name="官网 / App Store URL" rules={[{ type: 'url', warningOnly: true, message: 'URL 格式建议检查' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="職稱 / 職位" name="職稱 / 職位"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="歸屬國編號" name="歸屬國編號"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="歸屬省編號" name="歸屬省編號"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="分行號" name="分行號"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="開戶費合計" name="開戶費合計" rules={[numericRule]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="类型（企业）" name="类型（企业）"><Input /></Form.Item></Col>
            <Col span={24}><Form.Item label="企业描述" name="企业描述"><Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} /></Form.Item></Col>
          </Row>
          <Divider />
          <Typography.Title level={5}>6.5 附件与文档型字段</Typography.Title>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="退貨政策" name="退貨政策"><Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} /></Form.Item></Col>
            {['退貨政策截圖', '財務報表審計', 'NP其他文檔', '公司章程大綱包括章程細則（如適用）(非必須)'].map((field) => (
              <Col span={6} key={field}>
                <Form.Item label={field} name={field}>
                  <Input addonAfter={<Upload beforeUpload={() => false} showUploadList={false}><Button type="link" size="small" icon={<UploadOutlined />}>上传</Button></Upload>} />
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Card>

        <Card id="contact" title="企业联系信息区" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="公司電話" name="公司電話" rules={[{ required: true, message: '请输入公司電話' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="手提電話" name="手提電話"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="管理員電郵" name="管理員電郵" rules={[{ required: true, type: 'email', message: '请输入有效管理員電郵' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="運營電郵" name="運營電郵" rules={[{ type: 'email', message: '请输入有效運營電郵' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="接收營銷資訊" name="接收營銷資訊" valuePropName="checked"><Switch checkedChildren="是" unCheckedChildren="否" /></Form.Item></Col>
            <Col span={8}><Form.Item label="微信ID" name="微信ID"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="企业电话类型" name="企业电话类型"><Select options={enumOptions.phoneType} /></Form.Item></Col>
          </Row>
        </Card>

        <Card id="address" title="企业地址信息区" style={{ marginBottom: 16 }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>8.1 注册办事处地址</Typography.Title>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="註冊辦事處地址" name="註冊辦事處地址"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="註冊辦事處地址(英文)" name="註冊辦事處地址(英文)"><Input /></Form.Item></Col>
          </Row>
          <Divider />
          <Typography.Title level={5}>8.2 注册地址</Typography.Title>
          <Row gutter={16}>
            {['注册地址（原始全文）', '注册地址-街道', '注册地址-补充地址', '注册地址-城市', '注册地址-州 / 省', '注册地址-邮编', '注册地址-国家'].map((field) => (
              <Col span={field.includes('原始全文') ? 24 : 8} key={field}><Form.Item label={field} name={field}><Input /></Form.Item></Col>
            ))}
          </Row>
          <Divider />
          <Typography.Title level={5}>8.3 主要营业地址</Typography.Title>
          <Row gutter={16}>
            {['主要营业地址（原始全文）', '主要营业地址-街道', '主要营业地址-补充地址', '主要营业地址-城市', '主要营业地址-州 / 省', '主要营业地址-邮编', '主要营业地址-国家'].map((field) => (
              <Col span={field.includes('原始全文') ? 24 : 8} key={field}><Form.Item label={field} name={field}><Input /></Form.Item></Col>
            ))}
          </Row>
          <Divider />
          <Typography.Title level={5}>8.4 其他地址 / 联系</Typography.Title>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="郵寄地址" name="郵寄地址"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="電郵地址" name="電郵地址" rules={[{ type: 'email', message: '请输入有效邮箱格式' }]}><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card id="file" title="企业文件信息区" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="商業登記證號碼" name="商業登記證號碼"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="證書有效期" name="證書有效期"><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" /></Form.Item></Col>
          </Row>
          <Table
            rowKey="field"
            pagination={false}
            dataSource={fileFieldTable.map((field) => ({ field }))}
            columns={[
              { title: '字段名', dataIndex: 'field', width: '38%' },
              {
                title: '当前文件 / 操作',
                key: 'value',
                render: (_, record: { field: string }) => (
                  <Space wrap>
                    <Form.Item noStyle shouldUpdate>
                      {() => <Typography.Text>{form.getFieldValue(record.field) || '-'}</Typography.Text>}
                    </Form.Item>
                    <Upload beforeUpload={() => false} showUploadList={false}>
                      <Button size="small" icon={<UploadOutlined />}>上传替换</Button>
                    </Upload>
                    <Button size="small" icon={<EyeOutlined />}>查看</Button>
                  </Space>
                )
              }
            ]}
          />
        </Card>

        <Card id="risk" title="风控 / 业务信息区" style={{ marginBottom: 16 }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>风控信息</Typography.Title>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="風控類型" name="風控類型"><Select options={enumOptions.riskType} /></Form.Item></Col>
            <Col span={8}><Form.Item label="風險等級" name="風險等級"><Select options={enumOptions.riskLevel} /></Form.Item></Col>
            <Col span={8}><Form.Item label="風險評估報告" name="風險評估報告"><Input addonAfter={<Upload beforeUpload={() => false} showUploadList={false}><Button type="link" size="small" icon={<UploadOutlined />}>上传</Button></Upload>} /></Form.Item></Col>
            <Col span={8}><Form.Item label="是否高額商戶" name="是否高額商戶"><Select options={enumOptions.yesNo} /></Form.Item></Col>
          </Row>
          <Divider />
          <Typography.Title level={5}>业务协作信息</Typography.Title>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="審核類型" name="審核類型"><Select options={enumOptions.reviewType} /></Form.Item></Col>
            <Col span={8}><Typography.Text type="secondary">上單來源</Typography.Text><div>{readOnlyText(ent.source.join(' / '))}</div></Col>
            <Col span={8}><Form.Item label="服務類型" name="服務類型"><Select options={enumOptions.serviceType} /></Form.Item></Col>
            <Col span={8}><Form.Item label="合作夥伴推薦人" name="合作夥伴推薦人"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="合作夥伴編號" name="合作夥伴編號"><Input suffix={<Typography.Text copyable={{ text: form.getFieldValue('合作夥伴編號') || '' }} />} /></Form.Item></Col>
            <Col span={24}><Form.Item label="交單備註" name="交單備註"><Input.TextArea autoSize={{ minRows: 2, maxRows: 5 }} /></Form.Item></Col>
          </Row>
        </Card>

        <Card id="shops" title="关联商铺信息展示区" style={{ marginBottom: 16 }}>
          <Alert type="info" showIcon message="关联商铺不可在本页编辑，仅支持查看详情。" style={{ marginBottom: 12 }} />
          <Table
            rowKey="id"
            pagination={false}
            dataSource={ent.shops}
            columns={[
              { title: '商铺名称', dataIndex: 'name' },
              { title: '商铺编号', dataIndex: 'id' },
              { title: '地区', dataIndex: 'region' },
              { title: '启用状态', dataIndex: 'enableStatus', render: (v) => <Tag style={{ background: '#edf5ff', color: '#1f4b99' }}>{v || '-'}</Tag> },
              { title: '审核状态', dataIndex: 'reviewStatus', render: (v) => <Tag style={{ background: '#f4f5f7', color: '#334155' }}>{v || '-'}</Tag> },
              { title: '操作', render: (_, record: { id: string }) => <Button type="link" onClick={() => navigate(`/shops/${record.id}`)}>查看详情</Button> }
            ]}
          />
        </Card>

        <Card id="mids" title="关联 MID 信息展示区" style={{ marginBottom: 88 }}>
          <Alert type="info" showIcon message="关联 MID 不可在本页编辑，仅支持查看详情。" style={{ marginBottom: 12 }} />
          <Table
            rowKey="id"
            pagination={false}
            dataSource={ent.mids}
            columns={[
              { title: 'MID 编号', dataIndex: 'id' },
              { title: '所属商铺', dataIndex: 'shopName' },
              { title: '服务通道', dataIndex: 'channel' },
              { title: '当前状态', dataIndex: 'status' },
              { title: '更新时间', dataIndex: 'updatedAt' },
              { title: '操作', render: () => <Button type="link">查看详情</Button> }
            ]}
          />
        </Card>

        <Card title="底部悬浮操作区" className="sticky-bottom-actions" style={{ position: 'sticky', bottom: 0, zIndex: 50 }}>
          <Space>
            <Button onClick={() => navigate(-1)}>取消</Button>
            <Button type="primary" htmlType="submit" disabled={!canSubmit}>提交修改</Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
};
