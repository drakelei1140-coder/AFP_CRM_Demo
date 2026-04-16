import { Alert, Badge, Button, Card, Checkbox, Col, Descriptions, Divider, Form, Input, Row, Select, Space, Switch, Tag, Typography, Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import { type CSSProperties, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type ReviewStatus = '待审核' | '基础资料审核' | '销售主管审核' | '风控核查' | '风控初级审核' | '风控中级审核' | '总经理审核' | '风控审核完成';

interface MerchantEditData {
  id: string;
  basicInfo: Record<string, string>;
  enterpriseSummary: Record<string, string>;
  shopSummary: Record<string, string>;
  afpInfo: Record<string, string>;
  settlementReadonly: Record<string, string>;
  specialRate: Record<string, string>;
  formDefaults: Record<string, unknown>;
}

const mockMap: Record<string, MerchantEditData> = {
  'm-2': {
    id: 'm-2',
    basicInfo: {
      MID: 'MID-002', CID: 'CID-101', SID: 'SID-10002', 渠道编码: 'ADY_PAYFAC', 服务编码: 'POS_CORE, POS_EXT', 进件通道: 'Adyen-payfac', 商户审核状态: '基础资料审核', 当前审核人: 'OPS-Ryan', 上單來源: 'DMO', 创建人: 'DMO', 创建时间: '2026-04-02 12:00:00', 更新时间: '2026-04-03 15:00:00'
    },
    enterpriseSummary: {
      企业主显示名称: 'HK Food Group', CID: 'CID-101', 企业审核状态: '待风控审核', 企业启用状态: '-', '企業 LE ID': 'LE-90001', '進件通道(必須)': 'Adyen-payfac', 上單來源: 'DMO', 关键风险与经营摘要字段: '風險等級: 低；行業分類: 餐飲；平均每月營業額: HKD 2,600,000'
    },
    shopSummary: {
      商铺主显示名称: '旺角站前店', SID: 'SID-10002', 商铺审核状态: '待风控审核', 商铺启用状态: '-', 'Store ID': 'STORE-90002', 所属企业名称: 'HK Food Group', '進件通道(必須)': 'Adyen-payfac', 上單來源: 'DMO', 关键风险与经营摘要字段: '風險等級: 低；商鋪營業狀態: 營業中；平均每月營業額: HKD 1,800,000'
    },
    afpInfo: {
      'AFP Store ID': 'ST_AFP_90002',
      'AFP Store参考号 / 门店编码': 'ST_REF_90002',
      'AFP merchant account ID': 'MA_009002',
      'AFP Store状态': 'active',
      'AFP Store shopper statement': 'KPay MK',
      'AFP Store本地对账单脚本': '-',
      'AFP Store本地对账单文本': '-',
      'AFP Store外部参考号': 'EXT-90002',
      'AFP Store分账目标BA ID': 'BA-001',
      'AFP Store分账配置ID': 'SPLIT-001',
      'AFP sub-merchant email': 'mk@shop.demo',
      'AFP sub-merchant scheme id': 'SCHEME-01',
      'AFP sub-merchant MCC': '5812',
      'AFP sub-merchant name': 'MK Store'
    },
    settlementReadonly: {
      'AFP返回-結算週期': 'D+1（只读）',
      'AFP返回-結算幣種': 'HKD（只读）'
    },
    specialRate: {
      是否存在在途特殊费率申请: '是',
      特殊费率申请单号: 'SPR-202604-001',
      特殊费率申请状态: '审批中',
      特殊费率申请结果: '-',
      特殊费率申请完成时间: '-'
    },
    formDefaults: {
      '進件通道': 'Adyen-payfac',
      清算模式: 'T+1',
      'Store参考号 / 门店编码': 'ST_REF_90002',
      H5支付域名: 'https://pay.shop.demo',
      結算摘要前綴: 'KPAY',
      卡類型: 'VISA/MASTERCARD',
      結算身份證號: 'A123456(7)',
      結算週期: 'D+1',
      結算幣種: 'HKD',
      NP結算週期: 'D+1',
      打款銀行: 'DBS',
      FPS賬號: 'FPS-9002',
      收款銀行賬戶名稱: 'HK Food Group Ltd',
      銀行名稱: 'DBS HK',
      銀行號碼: '012',
      銀行編號: '1002',
      銀行卡歸屬國: 'HK',
      銀行卡歸屬省: '-',
      使用費率模板: 'TPL-01',
      沒有合適的費率模板: false,
      自定义费率: '否',
      费率模板ID: 'TPL-01',
      支付方式产品配置: 'PM-CONF-001',
      產品開通: ['POS', 'Settlement', 'QR'],
      'VISA 收單-消費': true,
      'MASTERCARD 收單-消費': true,
      'AMERICAEXPRESS 收單-消費': false,
      'UNIONPAY 收單-消費': true,
      'JCB 收單-消費': false,
      'DINERSCLUB 收單-消費': false,
      '收單-預授權': true,
      'VISA 收單-分期消費': false,
      'MASTERCARD 收單-分期消費': false,
      '微信支付-正掃': true,
      '微信支付-反掃': true,
      '支付寶-正掃': true,
      '支付寶-反掃': true,
      '微信支付-靜態二維碼': true,
      '支付寶-靜態二維碼': true,
      二維碼支付: true,
      '微信APP支付（缐上）': false,
      '微信H5支付（缐上）': false,
      '微信小程序支付（缐上）': false,
      '支付寶H5支付（缐上）': false,
      '支付寶App支付（缐上）': false,
      '支付寶WEB支付（缐上）': false,
      商户补充备注: '门店扩张阶段，交易量预计增长。',
      审核备注: '需核对银行附件有效期。',
      对外补充说明: '结算信息已按最新资料更新。',
      内部处理备注: '本次提交仅生成待审核修改记录。'
    }
  }
};

const statusTag = (status: ReviewStatus) => {
  const styleMap: Record<ReviewStatus, CSSProperties> = {
    待审核: { background: '#FFF7E6', borderColor: '#FFD591', color: '#D48806' },
    基础资料审核: { background: '#EEF3FF', borderColor: '#B4C8FF', color: '#1D39C4' },
    销售主管审核: { background: '#F0F5FF', borderColor: '#ADC6FF', color: '#1D39C4' },
    风控核查: { background: '#FFFBE6', borderColor: '#FFE58F', color: '#D48806' },
    风控初级审核: { background: '#F6FFED', borderColor: '#B7EB8F', color: '#389E0D' },
    风控中级审核: { background: '#E6FFFB', borderColor: '#87E8DE', color: '#08979C' },
    总经理审核: { background: '#F9F0FF', borderColor: '#D3ADF7', color: '#531DAB' },
    风控审核完成: { background: '#F6FFED', borderColor: '#B7EB8F', color: '#237804' }
  };
  return <Tag style={styleMap[status]}>{status}</Tag>;
};

const dummyUploadList = (name: string): UploadFile[] => [{ uid: name, name, status: 'done' }];

export const MerchantReviewEditPage = () => {
  const { id = 'm-2' } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const data = mockMap[id] || mockMap['m-2'];

  const editablePaymentFieldSet = useMemo(() => new Set([
    'VISA 收單-消費', 'MASTERCARD 收單-消費', 'UNIONPAY 收單-消費', '收單-預授權', '微信支付-正掃', '微信支付-反掃', '支付寶-正掃', '支付寶-反掃', '二維碼支付'
  ]), []);

  const bankRules = {
    FPS賬號: [{ required: true, message: '请填写 FPS賬號' }, { pattern: /^[A-Za-z0-9-]{4,40}$/, message: 'FPS賬號格式不正确' }],
    銀行號碼: [{ required: true, message: '请填写 銀行號碼' }, { pattern: /^\d{3,6}$/, message: '銀行號碼应为 3-6 位数字' }],
    銀行編號: [{ required: true, message: '请填写 銀行編號' }, { pattern: /^\d{3,10}$/, message: '銀行編號应为 3-10 位数字' }]
  };

  const onSubmit = async () => {
    await form.validateFields();
    message.success('已生成商户资料修改待审核记录（demo 模拟），正式数据未直接覆盖。');
    navigate(`/merchants/${id}`);
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>商户审核编辑</Typography.Title>
        <Typography.Text type="secondary">本页用于商户（MID）资料修订，仅提交待审核修改记录。</Typography.Text>
      </div>

      <Card title="基础信息区">
        <Descriptions
          bordered
          size="small"
          column={3}
          items={Object.entries(data.basicInfo).map(([key, value]) => ({
            key,
            label: key,
            children: key === 'MID' || key === 'CID' || key === 'SID'
              ? <Typography.Text copyable>{value}</Typography.Text>
              : key === '商户审核状态'
                ? statusTag(value as ReviewStatus)
                : value || '-'
          }))}
        />
      </Card>

      <Form form={form} layout="vertical" initialValues={data.formDefaults}>
        <Card title="商户资料编辑区">
          <Row gutter={16}>
            <Col span={8}><Form.Item label="進件通道" name="進件通道" rules={[{ required: true, message: '请选择進件通道' }]}><Select options={[{ value: 'Adyen-payfac' }, { value: 'Adyen-AFP' }, { value: 'Other' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="清算模式" name="清算模式" rules={[{ required: true, message: '请选择清算模式' }]}><Select options={[{ value: 'T+1' }, { value: 'T+2' }, { value: 'D+1' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="Store参考号 / 门店编码" name="Store参考号 / 门店编码" rules={[{ required: true, message: '请填写 Store参考号 / 门店编码' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="H5支付域名" name="H5支付域名" rules={[{ type: 'url', message: '请输入合法 URL' }]}><Input placeholder="https://" /></Form.Item></Col>
            <Col span={8}><Form.Item label="結算摘要前綴" name="結算摘要前綴" rules={[{ required: true, message: '请填写結算摘要前綴' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="卡類型" name="卡類型"><Select mode="multiple" options={[{ value: 'VISA' }, { value: 'MASTERCARD' }, { value: 'AMEX' }, { value: 'UNIONPAY' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="結算身份證號" name="結算身份證號" rules={[{ required: true, message: '请填写結算身份證號' }]}><Input /></Form.Item></Col>
          </Row>

          <Divider style={{ margin: '8px 0 16px' }} />
          <Row gutter={16}>
            <Col span={8}><Form.Item label="商户补充备注" name="商户补充备注" rules={[{ max: 500, message: '最多 500 字' }]}><Input.TextArea rows={3} /></Form.Item></Col>
            <Col span={8}><Form.Item label="审核备注" name="审核备注" rules={[{ max: 500, message: '最多 500 字' }]}><Input.TextArea rows={3} /></Form.Item></Col>
            <Col span={8}><Form.Item label="对外补充说明" name="对外补充说明" rules={[{ max: 500, message: '最多 500 字' }]}><Input.TextArea rows={3} /></Form.Item></Col>
            <Col span={24}><Form.Item label="内部处理备注" name="内部处理备注" rules={[{ max: 1000, message: '最多 1000 字' }]}><Input.TextArea rows={3} /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="企业信息展示区" extra={<Button type="link" onClick={() => navigate(`/enterprises/${data.basicInfo.CID}`)}>查看详情</Button>}>
          <Alert style={{ marginBottom: 12 }} type="info" showIcon message="企业审核请回到商户详情页处理，本页仅展示企业摘要信息。" />
          <Descriptions bordered column={3} size="small" items={Object.entries(data.enterpriseSummary).map(([k, v]) => ({ key: k, label: k, children: k.includes('状态') ? <Badge status="processing" text={v} /> : v || '-' }))} />
        </Card>

        <Card title="商铺信息展示区" extra={<Button type="link" onClick={() => navigate(`/shops/${data.basicInfo.SID}`)}>查看详情</Button>}>
          <Alert style={{ marginBottom: 12 }} type="info" showIcon message="商铺审核请回到商户详情页处理，本页仅展示商铺摘要信息。" />
          <Descriptions bordered column={3} size="small" items={Object.entries(data.shopSummary).map(([k, v]) => ({ key: k, label: k, children: k.includes('状态') ? <Badge status="processing" text={v} /> : v || '-' }))} />
        </Card>

        <Card title="AFP / 渠道信息展示区">
          <Typography.Text type="secondary">AFP / 渠道相关信息由通道返回或同步，本页仅展示，不支持编辑。</Typography.Text>
          <Descriptions style={{ marginTop: 12 }} bordered column={3} size="small" items={Object.entries(data.afpInfo).map(([k, v]) => ({ key: k, label: k, children: k.includes('状态') ? <Tag color="processing">{v}</Tag> : v || '-' }))} />
        </Card>

        <Card title="结算与银行信息区">
          <Alert style={{ marginBottom: 12 }} type="info" showIcon message="若字段由 AFP 回写则仅展示；本区域仅允许编辑平台补录结算资料。" />
          <Descriptions size="small" bordered column={2} items={Object.entries(data.settlementReadonly).map(([k, v]) => ({ key: k, label: k, children: v }))} />
          <Divider style={{ margin: '16px 0' }} />
          <Row gutter={16}>
            <Col span={8}><Form.Item label="結算週期" name="結算週期" rules={[{ required: true, message: '请选择結算週期' }]}><Select options={[{ value: 'D+1' }, { value: 'D+2' }, { value: 'T+1' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="結算幣種" name="結算幣種" rules={[{ required: true, message: '请选择結算幣種' }]}><Select options={[{ value: 'HKD' }, { value: 'USD' }, { value: 'SGD' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="NP結算週期" name="NP結算週期"><Select options={[{ value: 'D+1' }, { value: 'D+2' }, { value: 'T+1' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="打款銀行" name="打款銀行" rules={[{ required: true, message: '请填写打款銀行' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="FPS賬號" name="FPS賬號" rules={bankRules.FPS賬號}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="收款銀行賬戶名稱" name="收款銀行賬戶名稱" rules={[{ required: true, message: '请填写收款銀行賬戶名稱' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="銀行名稱" name="銀行名稱" rules={[{ required: true, message: '请填写銀行名稱' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="銀行號碼" name="銀行號碼" rules={bankRules.銀行號碼}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="銀行編號" name="銀行編號" rules={bankRules.銀行編號}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="銀行卡歸屬國" name="銀行卡歸屬國" rules={[{ required: true, message: '请填写銀行卡歸屬國' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="銀行卡歸屬省" name="銀行卡歸屬省"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="一份銀行戶口月結單（最近三個月內銀行發出的）" name="一份銀行戶口月結單（最近三個月內銀行發出的）"><Upload beforeUpload={() => false} defaultFileList={dummyUploadList('bank_statement.pdf')}><Button icon={<UploadOutlined />}>上传或替换</Button></Upload></Form.Item></Col>
            <Col span={8}><Form.Item label="FPS-DBS 申請文件" name="FPS-DBS 申請文件"><Upload beforeUpload={() => false} defaultFileList={dummyUploadList('fps_dbs.pdf')}><Button icon={<UploadOutlined />}>上传或替换</Button></Upload></Form.Item></Col>
          </Row>
        </Card>

        <Card title="产品与支付方式信息区">
          <Row gutter={16}>
            <Col span={8}><Form.Item label="產品開通" name="產品開通" rules={[{ required: true, message: '请选择產品開通' }]}><Checkbox.Group options={[{ label: 'POS', value: 'POS' }, { label: 'Settlement', value: 'Settlement' }, { label: 'QR', value: 'QR' }, { label: 'Online', value: 'Online' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="使用費率模板" name="使用費率模板" rules={[{ required: true, message: '请选择使用費率模板' }]}><Select options={[{ value: 'TPL-01' }, { value: 'TPL-02' }, { value: 'CUSTOM' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="沒有合適的費率模板" name="沒有合適的費率模板" valuePropName="checked"><Switch /></Form.Item></Col>
            <Col span={8}><Form.Item label="自定义费率" name="自定义费率"><Select options={[{ value: '是' }, { value: '否' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="费率模板ID" name="费率模板ID"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="支付方式产品配置" name="支付方式产品配置"><Input /></Form.Item></Col>
          </Row>

          <Divider orientation="left" style={{ marginTop: 0 }}>银行卡产品</Divider>
          <Row gutter={16}>
            {['VISA 收單-消費', 'MASTERCARD 收單-消費', 'AMERICAEXPRESS 收單-消費', 'UNIONPAY 收單-消費', 'JCB 收單-消費', 'DINERSCLUB 收單-消費', '收單-預授權', 'VISA 收單-分期消費', 'MASTERCARD 收單-分期消費'].map((field) => (
              <Col span={8} key={field}><Form.Item label={field} name={field} valuePropName="checked"><Switch disabled={!editablePaymentFieldSet.has(field)} /></Form.Item></Col>
            ))}
          </Row>

          <Divider orientation="left">二维码 / 钱包支付</Divider>
          <Row gutter={16}>
            {['微信支付-正掃', '微信支付-反掃', '支付寶-正掃', '支付寶-反掃', '微信支付-靜態二維碼', '支付寶-靜態二維碼', '二維碼支付', '微信APP支付（缐上）', '微信H5支付（缐上）', '微信小程序支付（缐上）', '支付寶H5支付（缐上）', '支付寶App支付（缐上）', '支付寶WEB支付（缐上）'].map((field) => (
              <Col span={8} key={field}><Form.Item label={field} name={field} valuePropName="checked"><Switch disabled={!editablePaymentFieldSet.has(field)} /></Form.Item></Col>
            ))}
          </Row>

          <Divider orientation="left">其他支付资料</Divider>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="八達通申請簽名" name="八達通申請簽名"><Upload beforeUpload={() => false} defaultFileList={dummyUploadList('octopus_sign.pdf')}><Button icon={<UploadOutlined />}>补录/替换</Button></Upload></Form.Item></Col>
            <Col span={8}><Form.Item label="八達通授權書" name="八達通授權書"><Upload beforeUpload={() => false} defaultFileList={dummyUploadList('octopus_auth.pdf')}><Button icon={<UploadOutlined />}>补录/替换</Button></Upload></Form.Item></Col>
            <Col span={8}><Form.Item label="現有八達通服務終止日期" name="現有八達通服務終止日期" rules={[{ pattern: /^$|^\d{4}-\d{2}-\d{2}$/, message: '日期格式为 YYYY-MM-DD' }]}><Input placeholder="YYYY-MM-DD" /></Form.Item></Col>
            <Col span={8}><Form.Item label="按金收取憑證" name="按金收取憑證"><Upload beforeUpload={() => false} defaultFileList={dummyUploadList('deposit_receipt.pdf')}><Button icon={<UploadOutlined />}>补录/替换</Button></Upload></Form.Item></Col>
          </Row>
        </Card>

        <Card title="特殊费率申请信息展示区">
          <Descriptions bordered column={3} size="small" items={Object.entries(data.specialRate).map(([k, v]) => ({ key: k, label: k, children: v || '-' }))} />
        </Card>

        <Card>
          <Space>
            <Button type="primary" onClick={onSubmit}>保存并提交审核</Button>
            <Button onClick={() => navigate(`/merchants/${id}`)}>取消</Button>
          </Space>
        </Card>
      </Form>
    </Space>
  );
};
