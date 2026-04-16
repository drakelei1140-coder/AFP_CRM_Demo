import { Button, Card, Col, Descriptions, Form, Input, Modal, Row, Select, Space, Table, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductRateTable, buildRateRows, type ProductRateRow } from '../components/ProductRateTable';

interface MerchantDraft { id: string; owner: string; channels?: string[]; 打款银行?: string; }
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

const OPERATOR = 'Ops User';
const DRAFT_KEY = 'merchant-drafts';

const enterpriseOptions: EnterpriseOption[] = [
  {
    id: 'ent-1',
    summary: {
      企业主显示名称: 'HK Food Group', CID: 'CID-101', 企业启用状态: '-', 企业审核状态: '待風控审核', 公司模式: '連鎖', 法律地位: '有限公司', 行业分类: '餐飲'
    }
  },
  {
    id: 'ent-2',
    summary: {
      企业主显示名称: 'Approved Active Co', CID: 'CID-104', 企业启用状态: '啟用', 企业审核状态: '审核通過', 公司模式: '單體', 法律地位: '有限公司', 行业分类: '零售'
    }
  }
];

const shopOptions: ShopOption[] = [
  {
    id: 'shop-1',
    enterpriseId: 'ent-1',
    summary: {
      商铺主显示名称: '旺角站前店', SID: 'SID-10002', 所属企业名称: 'HK Food Group', 商铺启用状态: '-', 商铺审核状态: '待風控审核', 商铺类型: '線下門店', 经营模式: '直營'
    }
  },
  {
    id: 'shop-2',
    enterpriseId: 'ent-1',
    summary: {
      商铺主显示名称: '尖沙咀旗艦店', SID: 'SID-10001', 所属企业名称: 'HK Food Group', 商铺启用状态: '-', 商铺审核状态: '待审核', 商铺类型: '線下門店', 经营模式: '直營'
    }
  },
  {
    id: 'shop-3',
    enterpriseId: 'ent-2',
    summary: {
      商铺主显示名称: '中環金融中心店', SID: 'SID-10003', 所属企业名称: 'Approved Active Co', 商铺启用状态: '啟用', 商铺审核状态: '审核通過', 商铺类型: '線下門店', 经营模式: '加盟'
    }
  }
];

const navItems = [
  ['overview', '商户概覽'],
  ['keys', '主鍵與關聯'],
  ['enterprise', '企业选择信息'],
  ['shop', '商铺选择信息'],
  ['merchantProfile', '商户資料'],
  ['settlement', '结算與银行信息'],
  ['channel', '通道选择'],
  ['rate', '產品費率'],
  ['special', '特殊費率申请信息']
] as const;

export const MerchantCreatePage = () => {
  const [form] = Form.useForm();
  const [rates, setRates] = useState<ProductRateRow[]>(buildRateRows());
  const [activeSection, setActiveSection] = useState('overview');
  const [draftOpen, setDraftOpen] = useState(false);
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [draftKeyword, setDraftKeyword] = useState('');
  const [enterpriseKeyword, setEnterpriseKeyword] = useState('');
  const [shopKeyword, setShopKeyword] = useState('');
  const nav = useNavigate();

  const channels: string[] = Form.useWatch('channels', form) || [];
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

  const drafts = useMemo<MerchantDraft[]>(() => JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: MerchantDraft) => x.owner === OPERATOR), []);
  const filteredDrafts = useMemo(() => drafts.filter((x) => !draftKeyword || x.id.includes(draftKeyword)), [draftKeyword, drafts]);
  const filteredEnterprises = useMemo(() => enterpriseOptions.filter((x) => !enterpriseKeyword || x.summary.CID.includes(enterpriseKeyword) || x.summary.企业主显示名称.toLowerCase().includes(enterpriseKeyword.toLowerCase())), [enterpriseKeyword]);
  const filteredShops = useMemo(() => shopOptions.filter((x) => (!enterpriseId || x.enterpriseId === enterpriseId) && (!shopKeyword || x.summary.SID.includes(shopKeyword) || x.summary.商铺主显示名称.toLowerCase().includes(shopKeyword.toLowerCase()))), [enterpriseId, shopKeyword]);

  const selectedEnterprise = useMemo(() => enterpriseOptions.find((x) => x.id === enterpriseId), [enterpriseId]);
  const selectedShop = useMemo(() => shopOptions.find((x) => x.id === shopId), [shopId]);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Card id="overview">
        <Typography.Title level={3} style={{ margin: 0 }}>新增商户</Typography.Title>
        <Typography.Text type="secondary">保存後進入待审核，字段口徑與商户詳情頁保持一致。</Typography.Text>
        <Descriptions style={{ marginTop: 12 }} bordered size="small" column={3} items={[
          { key: 'mid', label: 'MID', children: '保存後生成' },
          { key: 'cid', label: 'CID', children: selectedEnterprise?.summary.CID || '-' },
          { key: 'sid', label: 'SID', children: selectedShop?.summary.SID || '-' },
          { key: 'source', label: '上單來源', children: 'DMO' },
          { key: 'reviewer', label: '当前审核人', children: '-' },
          { key: 'operator', label: '创建人', children: OPERATOR },
          { key: 'createTime', label: '创建时间', children: '-' },
          { key: 'updateTime', label: '更新时间', children: '-' },
          { key: 'status', label: '商户审核状态', children: '待审核' }
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
        initialValues={{ 上單來源: 'DMO', channels: [], 商户审核状态: '待审核' }}
      >
        <Card id="keys" title="主鍵與關聯信息區">
          <Row gutter={16}>
            <Col span={8}><Form.Item label="MID" name="MID"><Input disabled placeholder="保存後生成" /></Form.Item></Col>
            <Col span={8}><Form.Item label="CID" name="CID"><Input value={selectedEnterprise?.summary.CID} readOnly /></Form.Item></Col>
            <Col span={8}><Form.Item label="SID" name="SID"><Input value={selectedShop?.summary.SID} readOnly /></Form.Item></Col>
            <Col span={8}><Form.Item label="渠道编码" name="渠道编码" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="服务编码" name="服务编码" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="进件通道" name="进件通道" rules={[{ required: true }]}><Select options={[{ value: 'Adyen_AFP' }]} /></Form.Item></Col>
          </Row>
        </Card>

        <Card id="enterprise" title="企业新增 / 选择區" style={{ marginTop: 16 }} extra={<Space><Button onClick={() => window.open('/enterprises/new', '_blank')}>新增企业</Button><Button onClick={() => setEnterpriseOpen(true)}>选择企业</Button></Space>}>
          <Form.Item name="enterpriseId" hidden><Input /></Form.Item>
          <Descriptions bordered size="small" column={3} items={Object.entries(selectedEnterprise?.summary || {
            企业主显示名称: '-', CID: '-', 企业启用状态: '-', 企业审核状态: '-', 公司模式: '-', 法律地位: '-', 行业分类: '-'
          }).map(([k, v]) => ({ key: k, label: k.replace('企业', '企业').replace('显示', '显示').replace('状态', '状态').replace('审核', '审核').replace('法律地位', '法律地位').replace('公司模式', '公司模式').replace('行业分类', '行业分类'), children: v }))} />
        </Card>

        <Card id="shop" title="商铺新增 / 选择區" style={{ marginTop: 16 }} extra={<Space><Button disabled={!enterpriseId} onClick={() => window.open('/shops/new', '_blank')}>新增商铺</Button><Button disabled={!enterpriseId} onClick={() => setShopOpen(true)}>选择商铺</Button></Space>}>
          <Form.Item name="shopId" hidden><Input /></Form.Item>
          <Descriptions bordered size="small" column={3} items={Object.entries(selectedShop?.summary || {
            商铺主显示名称: '-', SID: '-', 所属企业名称: '-', 商铺启用状态: '-', 商铺审核状态: '-', 商铺类型: '-', 经营模式: '-'
          }).map(([k, v]) => ({ key: k, label: k.replace('商铺', '商铺').replace('显示', '显示').replace('状态', '状态').replace('审核', '审核').replace('类型', '类型').replace('经营', '经营'), children: v }))} />
        </Card>

        <Card id="merchantProfile" title="商户資料填寫區" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="进件通道" name="商户进件通道"><Select options={[{ value: 'Adyen_AFP' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="清算模式" name="清算模式"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="Store參考号 / 門店編碼" name="Store參考号 / 門店編碼"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="H5支付域名" name="H5支付域名"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="结算摘要前綴" name="结算摘要前綴"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="卡类型" name="卡类型"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="结算身份證号" name="结算身份證号"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card id="settlement" title="结算與银行信息區" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="結算週期" name="結算週期"><Select options={[{ value: 'D+1' }, { value: 'T+1' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="結算幣種" name="結算幣種"><Select options={[{ value: 'HKD' }, { value: 'USD' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item label="NP結算週期" name="NP結算週期"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="打款銀行" name="打款銀行"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="FPS賬號" name="FPS賬號"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="收款銀行賬戶名稱" name="收款銀行賬戶名稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="银行名称" name="银行名称"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="银行号碼" name="银行号碼"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="银行编号" name="银行编号"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="银行卡歸屬國" name="银行卡歸屬國"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="银行卡歸屬省" name="银行卡歸屬省"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="一份银行户口月结單（最近三個月內银行發出的）" name="一份银行户口月结單（最近三個月內银行發出的）"><Input placeholder="文件名" /></Form.Item></Col>
            <Col span={8}><Form.Item label="FPS-DBS 申请文件" name="FPS-DBS 申请文件"><Input placeholder="文件名" /></Form.Item></Col>
          </Row>
        </Card>

        <Card id="channel" title="通道选择區" style={{ marginTop: 16 }}>
          <Form.Item label="通道（可多選）" name="channels" rules={[{ required: true }]}>
            <Select mode="multiple" options={[{ value: 'Adyen_AFP' }]} />
          </Form.Item>
        </Card>

        {channels.length > 0 && (
          <Card id="rate" title="產品費率區" style={{ marginTop: 16 }}>
            <ProductRateTable editable value={rates} onChange={setRates} />
          </Card>
        )}

        <Card id="special" title="特殊費率申请信息展示區" style={{ marginTop: 16 }}>
          <Descriptions bordered size="small" column={3} items={[
            { key: 'inProgress', label: '是否存在在途特殊費率申请', children: '否' },
            { key: 'id', label: '特殊費率申请單号', children: '-' },
            { key: 'result', label: '特殊費率申请结果', children: '-' },
            { key: 'time', label: '特殊費率申请完成時間', children: '-' }
          ]} />
        </Card>
      </Form>

      <div className="sticky-bottom-actions" style={{ position: 'sticky', bottom: 0, zIndex: 30 }}>
        <Space>
          <Button onClick={() => setDraftOpen(true)}>从草稿复制</Button>
          <Button onClick={() => { const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]'); const values = form.getFieldsValue(); all.unshift({ id: crypto.randomUUID(), owner: OPERATOR, ...values }); localStorage.setItem(DRAFT_KEY, JSON.stringify(all)); message.success('已存成草稿'); }}>存成草稿</Button>
          <Button
            type="primary"
            disabled={!enterpriseId || !shopId || channels.length === 0}
            onClick={async () => {
              await form.validateFields(['enterpriseId', 'shopId', 'channels', '渠道编码', '服务编码', '进件通道']);
              message.success('新增商户已保存，状态为待审核（demo模拟）');
              nav('/merchants/m-2');
            }}
          >
            保存
          </Button>
          <Button onClick={() => nav(-1)}>取消</Button>
        </Space>
      </div>

      <Modal open={enterpriseOpen} onCancel={() => setEnterpriseOpen(false)} footer={null} title="选择企业" width={940}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Row gutter={12}>
            <Col span={12}><Input placeholder="按编号搜索" value={enterpriseKeyword} onChange={(e) => setEnterpriseKeyword(e.target.value)} /></Col>
            <Col span={12}><Input placeholder="按名称模糊搜索" value={enterpriseKeyword} onChange={(e) => setEnterpriseKeyword(e.target.value)} /></Col>
          </Row>
          <Table rowKey="id" dataSource={filteredEnterprises} pagination={false} columns={[
            { title: '企业编号', dataIndex: ['summary', 'CID'] },
            { title: '企业名称', dataIndex: ['summary', '企业主显示名称'] },
            { title: '操作', render: (_, row: EnterpriseOption) => <Button type="link" onClick={() => { form.setFieldsValue({ enterpriseId: row.id, shopId: undefined, CID: row.summary.CID, SID: undefined }); setShopKeyword(''); setEnterpriseOpen(false); }}>选择</Button> }
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
            { title: '操作', render: (_, row: ShopOption) => <Button type="link" onClick={() => { form.setFieldValue('shopId', row.id); form.setFieldValue('SID', row.summary.SID); setShopOpen(false); }}>选择</Button> }
          ]} />
        </Space>
      </Modal>

      <Modal open={draftOpen} onCancel={() => setDraftOpen(false)} footer={null} title="商户草稿箱" width={900}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Row gutter={12}>
            <Col span={12}><Input placeholder="按编号搜索" value={draftKeyword} onChange={(e) => setDraftKeyword(e.target.value)} /></Col>
            <Col span={12}><Input placeholder="按名称模糊搜索" value={draftKeyword} onChange={(e) => setDraftKeyword(e.target.value)} /></Col>
          </Row>
          <Table rowKey="id" dataSource={filteredDrafts} pagination={false} columns={[
            { title: '草稿编号', dataIndex: 'id' },
            { title: '通道', dataIndex: 'channels', render: (v: string[]) => (v || []).join(', ') },
            { title: '打款银行', dataIndex: '打款银行' },
            { title: '操作', render: (_, r: MerchantDraft) => <Space><Button type="link" onClick={() => { form.setFieldsValue(r); setDraftOpen(false); }}>选择</Button><Button type="link" danger onClick={() => { const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: MerchantDraft) => x.id !== r.id); localStorage.setItem(DRAFT_KEY, JSON.stringify(all)); setDraftOpen(false); }}>删除</Button></Space> }
          ]} />
        </Space>
      </Modal>
    </Space>
  );
};
