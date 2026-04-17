import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, Space, Table, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnterpriseStore } from '../store/enterpriseStore';

interface ShopDraft { id: string; owner: string; 商铺中文名称?: string; 商铺电话?: string; 管理员电邮?: string; }
interface DeviceOption { id: string; model: string; category: string; serialNo: string; status: string; }
const OPERATOR = 'Ops User';
const DRAFT_KEY = 'shop-drafts';
const DEVICE_OPTIONS: DeviceOption[] = [
  { id: 'device-1', model: 'V400m', category: 'POS', serialNo: 'SN-900001', status: '库存可分配' },
  { id: 'device-2', model: 'A920', category: 'POS', serialNo: 'SN-900002', status: '库存可分配' },
  { id: 'device-3', model: 'MPOS-601', category: 'mPOS', serialNo: 'SN-900003', status: '库存可分配' }
];

const createNavItems = [
  ['keys', '商铺主键与关联'],
  ['names', '商铺名称信息'],
  ['operation', '商铺主体与经营信息'],
  ['basic', '商铺基础经营数据'],
  ['contact', '商铺联系信息'],
  ['address', '商铺地址信息'],
  ['files', '商铺文件信息'],
  ['risk', '风控 / 业务信息'],
  ['devices', '关联终端设备']
] as const;

export const ShopCreatePage = () => {
  const [form] = Form.useForm();
  const [draftOpen, setDraftOpen] = useState(false);
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [draftKeyword, setDraftKeyword] = useState('');
  const [enterpriseKeyword, setEnterpriseKeyword] = useState('');
  const [deviceKeyword, setDeviceKeyword] = useState('');
  const [activeSection, setActiveSection] = useState('keys');
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>();
  const nav = useNavigate();
  const { enterprises } = useEnterpriseStore();

  useEffect(() => {
    const nodes = createNavItems.map(([k]) => document.getElementById(k)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current?.target?.id) setActiveSection(current.target.id);
    }, { rootMargin: '-180px 0px -65% 0px', threshold: [0.1, 0.3, 0.6] });
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const drafts = useMemo<ShopDraft[]>(() => JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: ShopDraft) => x.owner === OPERATOR), []);
  const filteredDrafts = useMemo(() => drafts.filter((x) => !draftKeyword || x.id.includes(draftKeyword) || (x.商铺中文名称 || '').toLowerCase().includes(draftKeyword.toLowerCase())), [draftKeyword, drafts]);
  const filteredEnterprises = useMemo(() => enterprises.filter((x) => !enterpriseKeyword || x.cid.includes(enterpriseKeyword) || x.name.toLowerCase().includes(enterpriseKeyword.toLowerCase())), [enterpriseKeyword, enterprises]);
  const filteredDevices = useMemo(() => DEVICE_OPTIONS.filter((x) => !deviceKeyword || x.model.toLowerCase().includes(deviceKeyword.toLowerCase()) || x.serialNo.toLowerCase().includes(deviceKeyword.toLowerCase())), [deviceKeyword]);

  const copyFromEnterprise = () => {
    const ent = enterprises.find((e) => e.id === selectedEnterpriseId);
    if (!ent) return;
    form.setFieldsValue({
      商铺中文名称: `${ent.name} 商铺`,
      商铺英文名称: ent.englishName,
      管理员电邮: ent.email,
      商铺电话: ent.phone,
      '门店地址（原始全文）': ent.sections.address['主要营业地址（原始全文）'],
      '门店地址-城市': ent.sections.address['主要营业地址-城市'],
      '门店地址-国家': ent.sections.address['主要营业地址-国家']
    });
    message.success('已从企业复制映射信息');
  };

  const saveDraft = () => {
    const values = form.getFieldsValue();
    const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]');
    all.unshift({ id: crypto.randomUUID(), owner: OPERATOR, ...values, 商铺中文名称: values.商铺中文名称 || '未命名草稿' });
    localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
    message.success('已存成草稿');
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card><Typography.Title level={3} style={{ margin: 0 }}>新增商铺</Typography.Title><Typography.Text type="secondary">先选择企业，保存后进入待审核状态。</Typography.Text></Card>
      <div className="detail-section-nav-wrap" style={{ position: 'sticky', top: 88, zIndex: 20 }}><div className="detail-section-nav">{createNavItems.map(([k, t]) => <button key={k} type="button" className={`detail-section-nav-item ${activeSection === k ? 'active' : ''}`} onClick={() => document.getElementById(k)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{t}</button>)}</div></div>

      <Form form={form} layout="vertical">
        <Card id="keys" title="商铺主键与关联信息区" extra={<Space><Button onClick={copyFromEnterprise}>从企业复制信息</Button><Button onClick={() => setEnterpriseOpen(true)}>选择企业</Button></Space>}>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="SID" name="SID"><Input placeholder="保存后系统生成" disabled /></Form.Item></Col>
            <Col span={8}><Form.Item label="所属企业编号（CID）" name="所属企业编号（CID）"><Input readOnly placeholder="请先选择企业" value={enterprises.find((x) => x.id === selectedEnterpriseId)?.cid} /></Form.Item></Col>
            <Col span={8}><Form.Item label="所属企业名称" name="所属企业名称"><Input readOnly placeholder="请先选择企业" value={enterprises.find((x) => x.id === selectedEnterpriseId)?.name} /></Form.Item></Col>
            <Col span={8}><Form.Item label="默认主联系人人员ID" name="默认主联系人人员ID"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="上级商铺ID" name="上级商铺ID"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="所属地区" name="所属地区"><Input readOnly value={enterprises.find((x) => x.id === selectedEnterpriseId)?.region} /></Form.Item></Col>
            <Col span={8}><Form.Item label="服务通道" name="服务通道"><Input placeholder="保存后生成" /></Form.Item></Col>
          </Row>
        </Card>

        <Card id="names" title="商铺名称信息区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={8}><Form.Item name="商铺中文名称" label="商铺中文名称" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={8}><Form.Item name="商铺英文名称" label="商铺英文名称"><Input /></Form.Item></Col><Col span={8}><Form.Item name="门头名称" label="门头名称" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={8}><Form.Item name="收据显示名称" label="收据显示名称" rules={[{ required: true }]}><Input /></Form.Item></Col></Row></Card>
        <Card id="operation" title="商铺主体与经营信息区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={8}><Form.Item name="商铺类型" label="商铺类型"><Select options={[{ value: '线下门店' }, { value: '网店' }, { value: '活动店' }]} /></Form.Item></Col><Col span={8}><Form.Item name="经营模式" label="经营模式"><Select options={[{ value: '直营' }, { value: '加盟' }, { value: '连锁' }]} /></Form.Item></Col><Col span={8}><Form.Item name="行业分类 / 业务性质 / 产品服务" label="行业分类 / 业务性质 / 产品服务"><Input /></Form.Item></Col><Col span={8}><Form.Item name="MCC Code" label="MCC Code"><Input /></Form.Item></Col></Row></Card>
        <Card id="basic" title="商铺基础经营数据区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={8}><Form.Item name="進件通道(必須)" label="進件通道(必須)"><Input /></Form.Item></Col><Col span={8}><Form.Item name="每宗交易平均金額" label="每宗交易平均金額"><Input /></Form.Item></Col><Col span={8}><Form.Item name="每宗交易最大交易額" label="每宗交易最大交易額"><Input /></Form.Item></Col><Col span={8}><Form.Item name="預計每年交易宗數" label="預計每年交易宗數"><Input /></Form.Item></Col></Row></Card>
        <Card id="contact" title="商铺联系信息区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={8}><Form.Item name="商铺电话" label="商铺电话"><Input /></Form.Item></Col><Col span={8}><Form.Item name="管理员电邮" label="管理员电邮"><Input /></Form.Item></Col><Col span={8}><Form.Item name="运营电邮" label="运营电邮"><Input /></Form.Item></Col></Row></Card>
        <Card id="address" title="商铺地址信息区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={12}><Form.Item name="门店地址（原始全文）" label="门店地址（原始全文）"><Input /></Form.Item></Col><Col span={6}><Form.Item name="门店地址-城市" label="门店地址-城市"><Input /></Form.Item></Col><Col span={6}><Form.Item name="门店地址-国家" label="门店地址-国家"><Input /></Form.Item></Col></Row></Card>
        <Card id="files" title="商铺文件信息区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={12}><Form.Item name="门头照片" label="门头照片"><Input /></Form.Item></Col><Col span={12}><Form.Item name="营业场所证明" label="营业场所证明"><Input /></Form.Item></Col></Row></Card>
        <Card id="risk" title="风控 / 业务信息区" style={{ marginTop: 16 }}><Row gutter={16}><Col span={8}><Form.Item name="風控類型" label="風控類型"><Input /></Form.Item></Col><Col span={8}><Form.Item name="風險等級" label="風險等級"><Input /></Form.Item></Col><Col span={8}><Form.Item name="審核類型" label="審核類型"><Input /></Form.Item></Col><Col span={8}><Form.Item name="上單來源" label="上單來源"><Select mode="multiple" options={[{ value: 'CRM' }, { value: 'DMO' }, { value: 'SaaS' }, { value: '其他' }]} /></Form.Item></Col></Row></Card>

        <Card
          id="devices"
          title="关联终端设备信息展示区"
          style={{ marginTop: 16 }}
          extra={<Button onClick={() => setDeviceOpen(true)}>增加设备</Button>}
        >
          <Form.List name="relatedDevices">
            {(fields, { remove }) => (
              <Table
                rowKey={(record) => String(record?.id)}
                pagination={false}
                dataSource={fields.map((field) => ({ ...field, ...form.getFieldValue(['relatedDevices', field.name]) }))}
                locale={{ emptyText: '暂无设备，请点击“增加设备”选择' }}
                columns={[
                  { title: '设备型号', dataIndex: 'model' },
                  { title: '设备分类', dataIndex: 'category' },
                  { title: '设备序列号', dataIndex: 'serialNo' },
                  { title: '状态', dataIndex: 'status' },
                  {
                    title: '数量',
                    render: (_, record) => (
                      <Form.Item name={['relatedDevices', record.name, 'quantity']} initialValue={1} rules={[{ required: true, message: '请输入数量' }]}>
                        <InputNumber min={1} precision={0} controls={false} style={{ width: '100%' }} />
                      </Form.Item>
                    )
                  },
                  {
                    title: '支付金额',
                    render: (_, record) => (
                      <Form.Item name={['relatedDevices', record.name, 'paymentAmount']} initialValue={0} rules={[{ required: true, message: '请输入支付金额' }]}>
                        <InputNumber min={0} precision={2} controls={false} style={{ width: '100%' }} />
                      </Form.Item>
                    )
                  },
                  { title: '操作', render: (_, record) => <Button type="link" danger onClick={() => remove(record.name)}>移除</Button> }
                ]}
              />
            )}
          </Form.List>
        </Card>
      </Form>

      <div className="sticky-bottom-actions" style={{ position: 'sticky', bottom: 0, zIndex: 30 }}><Space><Button onClick={() => setDraftOpen(true)}>从草稿复制</Button><Button onClick={saveDraft}>存成草稿</Button><Button type="primary" onClick={async () => { await form.validateFields(['商铺中文名称', '门头名称', '收据显示名称']); if (!selectedEnterpriseId) { message.error('请先通过弹窗选择企业'); return; } message.success('新增商铺已保存，状态为待审核（demo模拟）'); nav('/shops/shop-1'); }}>保存</Button><Button onClick={() => nav(-1)}>取消</Button></Space></div>

      <Modal open={enterpriseOpen} onCancel={() => setEnterpriseOpen(false)} footer={null} title="选择企业" width={960}><Space direction="vertical" style={{ width: '100%' }} size={12}><Row gutter={12}><Col span={12}><Input placeholder="按编号搜索" value={enterpriseKeyword} onChange={(e) => setEnterpriseKeyword(e.target.value)} /></Col><Col span={12}><Input placeholder="按名称模糊搜索" value={enterpriseKeyword} onChange={(e) => setEnterpriseKeyword(e.target.value)} /></Col></Row><Table rowKey="id" dataSource={filteredEnterprises} pagination={false} columns={[{ title: '企业编号', dataIndex: 'cid' }, { title: '企业名称', dataIndex: 'name' }, { title: '地区', dataIndex: 'region' }, { title: '操作', render: (_, r) => <Button type="link" onClick={() => { setSelectedEnterpriseId(r.id); form.setFieldsValue({ '所属企业编号（CID）': r.cid, '所属企业名称': r.name, 所属地区: r.region }); setEnterpriseOpen(false); }}>选择</Button> }]} /></Space></Modal>

      <Modal open={deviceOpen} onCancel={() => setDeviceOpen(false)} footer={null} title="选择设备" width={900}>
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <Row gutter={12}>
            <Col span={12}><Input placeholder="按设备型号搜索" value={deviceKeyword} onChange={(e) => setDeviceKeyword(e.target.value)} /></Col>
            <Col span={12}><Input placeholder="按设备序列号搜索" value={deviceKeyword} onChange={(e) => setDeviceKeyword(e.target.value)} /></Col>
          </Row>
          <Table
            rowKey="id"
            dataSource={filteredDevices}
            pagination={false}
            columns={[
              { title: '设备型号', dataIndex: 'model' },
              { title: '设备分类', dataIndex: 'category' },
              { title: '设备序列号', dataIndex: 'serialNo' },
              { title: '状态', dataIndex: 'status' },
              {
                title: '操作',
                render: (_, device) => (
                  <Button
                    type="link"
                    onClick={() => {
                      const current: DeviceOption[] = form.getFieldValue('relatedDevices') || [];
                      const exists = current.some((item) => item.id === device.id);
                      if (exists) {
                        message.warning('该设备已选择');
                        return;
                      }
                      form.setFieldValue('relatedDevices', [...current, { ...device, quantity: 1, paymentAmount: 0 }]);
                      setDeviceOpen(false);
                    }}
                  >
                    选择
                  </Button>
                )
              }
            ]}
          />
        </Space>
      </Modal>

      <Modal open={draftOpen} onCancel={() => setDraftOpen(false)} footer={null} title="商铺草稿箱" width={900}><Space direction="vertical" style={{ width: '100%' }} size={12}><Row gutter={12}><Col span={12}><Input placeholder="按编号搜索" value={draftKeyword} onChange={(e) => setDraftKeyword(e.target.value)} /></Col><Col span={12}><Input placeholder="按名称模糊搜索" value={draftKeyword} onChange={(e) => setDraftKeyword(e.target.value)} /></Col></Row><Table rowKey="id" dataSource={filteredDrafts} pagination={false} columns={[{ title: '草稿编号', dataIndex: 'id' }, { title: '商铺名称', dataIndex: '商铺中文名称' }, { title: '电话', dataIndex: '商铺电话' }, { title: '邮箱', dataIndex: '管理员电邮' }, { title: '操作', render: (_, r: ShopDraft) => <Space><Button type="link" onClick={() => { form.setFieldsValue(r); setDraftOpen(false); }}>选择</Button><Button type="link" danger onClick={() => { const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: ShopDraft) => x.id !== r.id); localStorage.setItem(DRAFT_KEY, JSON.stringify(all)); setDraftOpen(false); }}>删除</Button></Space> }]} /></Space></Modal>
    </Space>
  );
};
