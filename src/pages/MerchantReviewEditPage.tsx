import { Button, Card, Col, Descriptions, Form, Input, Modal, Row, Select, Space, Table, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductRateTable, buildRateRows, type ProductRateRow } from '../components/ProductRateTable';

interface EnterpriseOption {
  id: string;
  summary: {
    企业主显示名称: string;
    CID: string;
    企业启用状态: string;
    企业审核状态: string;
    公司模式: string;
    法律地位: string;
    行业分类: string;
  };
}
interface ShopOption {
  id: string;
  enterpriseId: string;
  summary: {
    商铺主显示名称: string;
    SID: string;
    所属企业名称: string;
    商铺启用状态: string;
    商铺审核状态: string;
    商铺类型: string;
    经营模式: string;
  };
}

const enterpriseOptions: EnterpriseOption[] = [
  { id: 'ent-1', summary: { 企业主显示名称: 'HK Food Group', CID: 'CID-101', 企业启用状态: '-', 企业审核状态: '待风控审核', 公司模式: '连锁', 法律地位: '有限公司', 行业分类: '餐饮' } },
  { id: 'ent-2', summary: { 企业主显示名称: 'Approved Active Co', CID: 'CID-104', 企业启用状态: '启用', 企业审核状态: '审核通过', 公司模式: '单体', 法律地位: '有限公司', 行业分类: '零售' } }
];

const shopOptions: ShopOption[] = [
  { id: 'shop-1', enterpriseId: 'ent-1', summary: { 商铺主显示名称: '旺角站前店', SID: 'SID-10002', 所属企业名称: 'HK Food Group', 商铺启用状态: '-', 商铺审核状态: '待风控审核', 商铺类型: '线下门店', 经营模式: '直营' } },
  { id: 'shop-2', enterpriseId: 'ent-1', summary: { 商铺主显示名称: '尖沙咀旗舰店', SID: 'SID-10001', 所属企业名称: 'HK Food Group', 商铺启用状态: '-', 商铺审核状态: '待审核', 商铺类型: '线下门店', 经营模式: '直营' } },
  { id: 'shop-3', enterpriseId: 'ent-2', summary: { 商铺主显示名称: '中环金融中心店', SID: 'SID-10003', 所属企业名称: 'Approved Active Co', 商铺启用状态: '启用', 商铺审核状态: '审核通过', 商铺类型: '线下门店', 经营模式: '加盟' } }
];

const navItems = [
  ['overview', '商户概览'],
  ['keys', '主键与关联'],
  ['merchantProfile', '商户资料'],
  ['enterprise', '企业信息'],
  ['shop', '商铺信息'],
  ['settlement', '结算与银行信息'],
  ['productRate', '产品费率'],
  ['special', '特殊费率申请信息']
] as const;

export const MerchantReviewEditPage = () => {
  const { id = 'm-2' } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [rates, setRates] = useState<ProductRateRow[]>(buildRateRows());
  const [activeSection, setActiveSection] = useState('overview');
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [enterpriseKeyword, setEnterpriseKeyword] = useState('');
  const [shopKeyword, setShopKeyword] = useState('');

  const enterpriseId: string | undefined = Form.useWatch('enterpriseId', form);
  const shopId: string | undefined = Form.useWatch('shopId', form);

  useEffect(() => {
    const nodes = navItems.map(([k]) => document.getElementById(k)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current?.target?.id) setActiveSection(current.target.id);
    }, { rootMargin: '-180px 0px -65% 0px', threshold: [0.1, 0.3, 0.6] });
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const filteredEnterprises = useMemo(() => enterpriseOptions.filter((x) => !enterpriseKeyword || x.summary.CID.includes(enterpriseKeyword) || x.summary.企业主显示名称.toLowerCase().includes(enterpriseKeyword.toLowerCase())), [enterpriseKeyword]);
  const filteredShops = useMemo(() => shopOptions.filter((x) => (!enterpriseId || x.enterpriseId === enterpriseId) && (!shopKeyword || x.summary.SID.includes(shopKeyword) || x.summary.商铺主显示名称.toLowerCase().includes(shopKeyword.toLowerCase()))), [enterpriseId, shopKeyword]);

  const selectedEnterprise = useMemo(() => enterpriseOptions.find((x) => x.id === enterpriseId), [enterpriseId]);
  const selectedShop = useMemo(() => shopOptions.find((x) => x.id === shopId), [shopId]);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card id="overview" title="基础信息区（系统字段只读）">
        <Descriptions bordered size="small" column={3} items={[
          { key: 'mid', label: 'MID', children: 'MID-002' },
          { key: 'cid', label: 'CID', children: selectedEnterprise?.summary.CID || 'CID-101' },
          { key: 'sid', label: 'SID', children: selectedShop?.summary.SID || 'SID-10002' },
          { key: 'channelCode', label: '渠道编码', children: 'ADY_AFP' },
          { key: 'serviceCode', label: '服务编码', children: 'POS_CORE' },
          { key: 'channel', label: '进件通道', children: 'Adyen_AFP' },
          { key: 'status', label: '商户审核状态', children: '基础资料审核' },
          { key: 'reviewer', label: '当前审核人', children: 'OPS-Ryan' },
          { key: 'source', label: '上單來源', children: 'DMO' },
          { key: 'create', label: '创建时间', children: '2026-04-02 12:00:00' },
          { key: 'update', label: '更新时间', children: '2026-04-03 15:00:00' }
        ]} />
      </Card>

      <div className="detail-section-nav-wrap" style={{ position: 'sticky', top: 88, zIndex: 20 }}>
        <div className="detail-section-nav">
          {navItems.map(([k, t]) => (
            <button key={k} type="button" className={`detail-section-nav-item ${activeSection === k ? 'active' : ''}`} onClick={() => document.getElementById(k)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{t}</button>
          ))}
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{ enterpriseId: 'ent-1', shopId: 'shop-1', channels: ['Adyen_AFP'], 结算週期: 'D+1', 結算幣種: 'HKD', 打款銀行: 'DBS', FPS賬號: 'FPS-9002', 收款銀行賬戶名稱: 'HK Food Group Ltd' }}
      >
        <Card id="keys" title="主键与关联信息区">
          <Row gutter={16}>
            <Col span={8}><Form.Item label="MID"><Input value="MID-002" disabled /></Form.Item></Col>
            <Col span={8}><Form.Item label="CID"><Input value={selectedEnterprise?.summary.CID || ''} disabled /></Form.Item></Col>
            <Col span={8}><Form.Item label="SID"><Input value={selectedShop?.summary.SID || ''} disabled /></Form.Item></Col>
            <Col span={8}><Form.Item label="渠道编码" name="渠道编码" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="服务编码" name="服务编码" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="进件通道" name="进件通道" rules={[{ required: true }]}><Select options={[{ value: 'Adyen_AFP' }]} /></Form.Item></Col>
          </Row>
        </Card>

        <Card id="merchantProfile" title="商户资料编辑区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="進件通道" name="商戶進件通道"><Select options={[{ value: 'Adyen_AFP' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="清算模式" name="清算模式"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="Store参考号 / 门店编码" name="Store参考号 / 门店编码"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="H5支付域名" name="H5支付域名"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="結算摘要前綴" name="結算摘要前綴"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="卡類型" name="卡類型"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="結算身份證號" name="結算身份證號"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="商户补充备注" name="商户补充备注"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="审核备注" name="审核备注"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="对外补充说明" name="对外补充说明"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="内部处理备注" name="内部处理备注"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card id="enterprise" title="企业信息展示区" style={{ marginTop: 16 }} extra={<Space><Button onClick={() => window.open('/enterprises/new', '_blank')}>新增企业</Button><Button onClick={() => setEnterpriseOpen(true)}>选择企业</Button><Button type="link" onClick={() => window.open(`/enterprises/${selectedEnterprise?.summary.CID || 'CID-101'}`, '_blank')}>查看详情</Button></Space>}>
          <Form.Item name="enterpriseId" hidden><Input /></Form.Item>
          <Descriptions bordered size="small" column={3} items={Object.entries(selectedEnterprise?.summary || {
            企业主显示名称: '-', CID: '-', 企业启用状态: '-', 企业审核状态: '-', 公司模式: '-', 法律地位: '-', 行业分类: '-'
          }).map(([k, v]) => ({ key: k, label: k, children: v }))} />
        </Card>

        <Card id="shop" title="商铺信息展示区" style={{ marginTop: 16 }} extra={<Space><Button disabled={!enterpriseId} onClick={() => window.open('/shops/new', '_blank')}>新增商铺</Button><Button disabled={!enterpriseId} onClick={() => setShopOpen(true)}>选择商铺</Button><Button type="link" onClick={() => window.open(`/shops/${selectedShop?.summary.SID || 'SID-10002'}`, '_blank')}>查看详情</Button></Space>}>
          <Form.Item name="shopId" hidden><Input /></Form.Item>
          <Descriptions bordered size="small" column={3} items={Object.entries(selectedShop?.summary || {
            商铺主显示名称: '-', SID: '-', 所属企业名称: '-', 商铺启用状态: '-', 商铺审核状态: '-', 商铺类型: '-', 经营模式: '-'
          }).map(([k, v]) => ({ key: k, label: k, children: v }))} />
        </Card>

        <Card id="settlement" title="结算与银行信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="結算週期" name="結算週期"><Select options={[{ value: 'D+1' }, { value: 'T+1' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="結算幣種" name="結算幣種"><Select options={[{ value: 'HKD' }, { value: 'USD' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="NP結算週期" name="NP結算週期"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="打款銀行" name="打款銀行"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="FPS賬號" name="FPS賬號"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="收款銀行賬戶名稱" name="收款銀行賬戶名稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="銀行名稱" name="銀行名稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="銀行號碼" name="銀行號碼"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="銀行編號" name="銀行編號"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="銀行卡歸屬國" name="銀行卡歸屬國"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="銀行卡歸屬省" name="銀行卡歸屬省"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="一份銀行戶口月結單（最近三個月內銀行發出的）" name="一份銀行戶口月結單（最近三個月內銀行發出的）"><Input placeholder="文件名" /></Form.Item></Col>
            <Col span={8}><Form.Item label="FPS-DBS 申請文件" name="FPS-DBS 申請文件"><Input placeholder="文件名" /></Form.Item></Col>
          </Row>
        </Card>

        <Card id="productRate" title="产品费率区" style={{ marginTop: 16 }}>
          <Form.Item label="通道（可多选）" name="channels"><Select mode="multiple" options={[{ value: 'Adyen_AFP' }]} /></Form.Item>
          <ProductRateTable editable value={rates} onChange={setRates} />
        </Card>

        <Card id="special" title="特殊费率申请信息展示区" style={{ marginTop: 16 }}>
          <Descriptions bordered size="small" column={3} items={[
            { key: 'inProgress', label: '是否存在在途特殊费率申请', children: '否' },
            { key: 'id', label: '特殊费率申请单号', children: '-' },
            { key: 'status', label: '特殊费率申请状态', children: '-' },
            { key: 'result', label: '特殊费率申请结果', children: '-' }
          ]} />
        </Card>

        <div className="sticky-bottom-actions" style={{ position: 'sticky', bottom: 0, zIndex: 30, marginTop: 16 }}>
          <Space>
            <Button type="primary" onClick={async () => { await form.validateFields(); message.success('已生成商户资料修改待审核记录（demo 模拟）'); navigate(`/merchants/${id}`); }}>保存并提交审核</Button>
            <Button onClick={() => navigate(`/merchants/${id}`)}>取消</Button>
          </Space>
        </div>
      </Form>

      <Modal open={enterpriseOpen} onCancel={() => setEnterpriseOpen(false)} footer={null} title="选择企业" width={940}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Row gutter={12}>
            <Col span={12}><Input placeholder="按编号搜索" value={enterpriseKeyword} onChange={(e) => setEnterpriseKeyword(e.target.value)} /></Col>
            <Col span={12}><Input placeholder="按名称模糊搜索" value={enterpriseKeyword} onChange={(e) => setEnterpriseKeyword(e.target.value)} /></Col>
          </Row>
          <Table rowKey="id" dataSource={filteredEnterprises} pagination={false} columns={[
            { title: '企业编号', dataIndex: ['summary', 'CID'] },
            { title: '企业名称', dataIndex: ['summary', '企业主显示名称'] },
            { title: '操作', render: (_, row: EnterpriseOption) => <Button type="link" onClick={() => { form.setFieldsValue({ enterpriseId: row.id, shopId: undefined }); setEnterpriseOpen(false); }}>选择</Button> }
          ]} />
        </Space>
      </Modal>

      <Modal open={shopOpen} onCancel={() => setShopOpen(false)} footer={null} title="选择商铺" width={940}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Row gutter={12}>
            <Col span={12}><Input placeholder="按编号搜索" value={shopKeyword} onChange={(e) => setShopKeyword(e.target.value)} /></Col>
            <Col span={12}><Input placeholder="按名称模糊搜索" value={shopKeyword} onChange={(e) => setShopKeyword(e.target.value)} /></Col>
          </Row>
          <Table rowKey="id" dataSource={filteredShops} pagination={false} columns={[
            { title: '商铺编号', dataIndex: ['summary', 'SID'] },
            { title: '商铺名称', dataIndex: ['summary', '商铺主显示名称'] },
            { title: '操作', render: (_, row: ShopOption) => <Button type="link" onClick={() => { form.setFieldValue('shopId', row.id); setShopOpen(false); }}>选择</Button> }
          ]} />
        </Space>
      </Modal>
    </Space>
  );
};
