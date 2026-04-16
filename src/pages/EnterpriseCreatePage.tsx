import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnterpriseStore } from '../store/enterpriseStore';

interface EnterpriseDraft {
  id: string;
  owner: string;
  企业名称?: string;
  企业简称?: string;
  管理員電郵?: string;
  公司電話?: string;
}

const DRAFT_KEY = 'enterprise-drafts';
const OPERATOR = 'Ops User';

const navItems = ['企业主键与关联', '企业名称信息', '企业主体与经营信息', '企业基础经营数据', '企业联系信息', '企业地址信息', '风控 / 业务信息'];

export const EnterpriseCreatePage = () => {
  const [form] = Form.useForm();
  const [draftOpen, setDraftOpen] = useState(false);
  const [draftKeyword, setDraftKeyword] = useState('');
  const navigate = useNavigate();
  const { enterprises } = useEnterpriseStore();

  const drafts = useMemo<EnterpriseDraft[]>(() => JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: EnterpriseDraft) => x.owner === OPERATOR), []);
  const filteredDrafts = useMemo(
    () => drafts.filter((x) => !draftKeyword || x.id.includes(draftKeyword) || (x.企业名称 || '').toLowerCase().includes(draftKeyword.toLowerCase())),
    [draftKeyword, drafts]
  );

  const saveDraft = () => {
    const values = form.getFieldsValue();
    const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]');
    all.unshift({ id: crypto.randomUUID(), owner: OPERATOR, ...values, 企业名称: values.企业名称 || '未命名草稿' });
    localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
    message.success('已存成草稿');
  };

  const onSave = async () => {
    await form.validateFields(['企业名称', '企业简称', '公司模式', '法律地位']);
    message.success('新增企业已保存，状态为待审核（demo模拟）');
    navigate(`/enterprises/${enterprises[0].id}`);
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Typography.Title level={3} style={{ margin: 0 }}>新增企业</Typography.Title>
        <Typography.Text type="secondary">保存后进入待审核状态。当前操作人：{OPERATOR}</Typography.Text>
      </Card>

      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{navItems.map((n) => <Tag key={n} color="default">{n}</Tag>)}</div></div>

      <Form form={form} layout="vertical">
        <Card title="企业主键与关联信息区">
          <Row gutter={16}>
            <Col span={8}><Form.Item label="默认主联系人人员ID" name="默认主联系人人员ID"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="上級公司ID" name="上級公司ID"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="企业名称信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="企业名称" name="企业名称" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="企业简称" name="企业简称" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="英文名" name="英文名"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="商戶中文名稱" name="商戶中文名稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="商戶中文簡稱" name="商戶中文簡稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="商戶英文名稱" name="商戶英文名稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="商戶英文簡稱" name="商戶英文簡稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="商戶其它名稱" name="商戶其它名稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="商業登記證名稱" name="商業登記證名稱"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="企业主体与经营信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="公司模式" name="公司模式" rules={[{ required: true }]}><Select options={[{ value: '直营' }, { value: '加盟' }, { value: '连锁' }, { value: '其他' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="法律地位" name="法律地位" rules={[{ required: true }]}><Select options={[{ value: '个人' }, { value: '个体工商户' }, { value: '有限公司' }, { value: '股份有限公司' }, { value: '合伙企业' }, { value: '非营利组织' }, { value: '其他' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="成立日期" name="成立日期"><Input placeholder="YYYY-MM-DD" /></Form.Item></Col>
            <Col span={8}><Form.Item label="是否子公司" name="是否子公司"><Select options={[{ value: '是' }, { value: '否' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="公司結構" name="公司結構"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="行業分類/業務性質/產品服務" name="行業分類/業務性質/產品服務"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="MCC Code" name="MCC Code"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="進階MCC Code" name="進階MCC Code"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="小微商戶" name="小微商戶"><Select options={[{ value: '是' }, { value: '否' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="SME 設定" name="SME 設定"><Select options={[{ value: '是' }, { value: '否' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="僱員人數" name="僱員人數"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="注冊資本" name="注冊資本"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="企业基础经营数据区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="每宗交易平均金額" name="每宗交易平均金額"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="每宗交易最大交易額" name="每宗交易最大交易額"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="預計每年交易宗數" name="預計每年交易宗數"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="過往拒付比例" name="過往拒付比例"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="過往退款比例" name="過往退款比例"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="平均每月營業額" name="平均每月營業額"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="經營方式" name="經營方式"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="企业描述" name="企業描述"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="VAT号" name="VAT号"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="无VAT原因" name="无VAT原因"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="税务申报分类" name="税务申报分类"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="税务业务类型" name="税务业务类型"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="企业联系信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="公司電話" name="公司電話"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="手提電話" name="手提電話"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="管理員電郵" name="管理員電郵"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="運營電郵" name="運營電郵"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="接收營銷資訊" name="接收營銷資訊"><Select options={[{ value: '是' }, { value: '否' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="微信ID" name="微信ID"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="企业地址信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="註冊辦事處地址" name="註冊辦事處地址"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="註冊辦事處地址(英文)" name="註冊辦事處地址(英文)"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="注册地址（原始全文）" name="注册地址（原始全文）"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="注册地址-街道" name="注册地址-街道"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="注册地址-补充地址" name="注册地址-补充地址"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="注册地址-城市" name="注册地址-城市"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="注册地址-州/省" name="注册地址-州/省"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="注册地址-邮编" name="注册地址-邮编"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="注册地址-国家" name="注册地址-国家"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="主要营业地址（原始全文）" name="主要营业地址（原始全文）"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="主要营业地址-街道" name="主要营业地址-街道"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="主要营业地址-补充地址" name="主要营业地址-补充地址"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="主要营业地址-城市" name="主要营业地址-城市"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="主要营业地址-州/省" name="主要营业地址-州/省"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="主要营业地址-邮编" name="主要营业地址-邮编"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="主要营业地址-国家" name="主要营业地址-国家"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="郵寄地址" name="郵寄地址"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="電郵地址" name="電郵地址"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="风控 / 业务信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="風控類型" name="風控類型"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="風險等級" name="風險等級"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="審核類型" name="審核類型"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="上單來源" name="上單來源"><Select mode="multiple" options={[{ value: 'CRM' }, { value: 'DMO' }, { value: 'SaaS' }, { value: '其他' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="服務類型" name="服務類型"><Input /></Form.Item></Col>
            <Col span={24}><Form.Item label="本平台补充备注" name="本平台补充备注"><Input.TextArea rows={4} maxLength={500} /></Form.Item></Col>
          </Row>
        </Card>
      </Form>

      <div className="sticky-bottom-actions">
        <Space>
          <Button onClick={() => setDraftOpen(true)}>从草稿复制</Button>
          <Button onClick={saveDraft}>存成草稿</Button>
          <Button type="primary" onClick={onSave}>保存</Button>
          <Button onClick={() => navigate(-1)}>取消</Button>
        </Space>
      </div>

      <Modal open={draftOpen} onCancel={() => setDraftOpen(false)} footer={null} title="企业草稿箱" width={920}>
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <Row gutter={12}>
            <Col span={12}><Input placeholder="按编号搜索" value={draftKeyword} onChange={(e) => setDraftKeyword(e.target.value)} /></Col>
            <Col span={12}><Input placeholder="按名称模糊搜索" value={draftKeyword} onChange={(e) => setDraftKeyword(e.target.value)} /></Col>
          </Row>
          <Table rowKey="id" dataSource={filteredDrafts} columns={[
            { title: '草稿编号', dataIndex: 'id' },
            { title: '企业名称', dataIndex: '企业名称' },
            { title: '邮箱', dataIndex: '管理員電郵' },
            { title: '电话', dataIndex: '公司電話' },
            {
              title: '操作',
              render: (_, r: EnterpriseDraft) => <Space><Button type="link" onClick={() => { form.setFieldsValue(r); setDraftOpen(false); }}>选择</Button><Button type="link" danger onClick={() => {
                const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: EnterpriseDraft) => x.id !== r.id);
                localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
                message.success('草稿已删除');
                setDraftOpen(false);
              }}>删除</Button></Space>
            }
          ]} pagination={false} />
        </Space>
      </Modal>
    </Space>
  );
};
