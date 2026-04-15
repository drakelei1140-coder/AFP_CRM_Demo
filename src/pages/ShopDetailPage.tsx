import { Button, Card, Col, Descriptions, Divider, Input, List, Modal, Row, Space, Table, Timeline, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type ReviewStatus = '待审核' | '待风控审核' | '审核通过' | '审核不通过';
type EnableStatus = '启用' | '停用' | null;

interface TimelineRecord {
  time: string;
  operator: string;
  target: string;
  action: string;
  summary: string;
  remark?: string;
}

interface ShopDetail {
  id: string;
  name: string;
  sid: string;
  cid: string;
  enterpriseName: string;
  storeId: string;
  enableStatus: EnableStatus;
  reviewStatus: ReviewStatus;
  channels: string[];
  source: string[];
  createdAt: string;
  updatedAt: string;
  deviceCount: number;
  midCount: number;
  sections: Record<string, Record<string, string>>;
  afpStoreSummary: Record<string, string>;
  afpStoreDetail: Array<{ afpField: string; value: string; sourceField: string }>;
  afpTerminalSummary: Record<string, string>;
  afpTerminalDetail: Array<{ afpField: string; value: string; sourceField: string }>;
  terminalDevices: Array<{ model: string; category: string; quantity: number; bindStatus: string }>;
  relatedEnterprise: Array<{ name: string; cid: string; enableStatus: string; reviewStatus: string; contact: string; relation: string }>;
  relatedMid: Array<{ mid: string; thirdMid: string; channel: string; status: string; settlementTag: string; updatedAt: string }>;
  timeline: TimelineRecord[];
}

const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

const seed: Record<string, ShopDetail> = {
  'shop-1': {
    id: 'shop-1',
    name: '尖沙咀旗舰店', sid: 'SID-10001', cid: 'CID-101', enterpriseName: 'HK Food Group', storeId: 'STORE-90001',
    enableStatus: null, reviewStatus: '待审核', channels: ['Adyen-AFP'], source: ['CRM'], createdAt: '2026-04-01 10:00:00', updatedAt: '2026-04-01 10:00:00', deviceCount: 6, midCount: 2,
    sections: {
      keys: { SID: 'SID-10001', 'Store ID': 'STORE-90001', 'Store Reference': 'ST-REF-10001', '所属企业编号（CID）': 'CID-101', '所属企业名称': 'HK Food Group', '默认主联系人人员ID': 'P-1001', '上级商铺ID': '-', '所属地区': 'HK', '服务通道': 'Adyen-AFP' },
      names: { '商铺中文名称': '尖沙咀旗舰店', '商铺中文简称': '尖沙咀店', '商铺英文名称': 'TST Flagship Store', '商铺英文简称': 'TST Store', '商铺其它名称': '-', '商铺所有名称（中文）': '尖沙咀旗舰店;尖沙咀店', '商铺所有名称（英文）': 'TST Flagship Store;TST Store', '切换商铺显示名称（中文）': '尖沙咀旗舰店', '切换商铺显示名称（英文）': 'TST Flagship Store', '门头名称': 'KPay TST', '收据显示名称': 'KPay-TST' },
      operation: { '商铺类型': '线下门店', '经营模式': '直营', '是否总部': '否', '是否默认主门店': '是', '行业分类 / 业务性质 / 产品服务': '餐饮, 咖啡', 'MCC Code': '5812', '進階MCC Code': '5812A', 'special MCC 附件': 'special_mcc_store.pdf', '开店日期': '2020-08-01', '商铺营业状态': '营业中', '经营年限': '5', '小微商戶': '否', 'SME 設定': '是', '是否NGO': '否', '公司層級（门店口径如有）': 'L1', '经营说明': '旅游商圈核心门店' },
      basic: { '進件通道(必須)': 'Adyen-AFP', '每宗交易平均金額': '300', '每宗交易最大交易額': '2800', '預計每年交易宗數': '220000', '過往拒付比例': '0.12%', '拒付平均處理日數': '14', '過往退款比例': '0.33%', '退款平均處理日數': '5', '平均每月營業額': 'HKD 2,300,000', '經營方式': '到店消费', '提前收款日數': '1', '貨物 / 服務最短送達時間': '即时', '貨物 / 服務最長送達時間': '3天', '退貨政策': '7天可退', '退貨政策截圖': 'return_policy.png', '財務報表審計': '已审计', 'T1特選商戶': '否', '是否對公': '是', '小費功能': '是', '合約期': '24个月', '是否首次申請卡機商戶（包括KPay及其他卡機）': '否', '申請過的卡機品牌（多選）': 'KPay, Other', '在上述卡機中，商戶預計使用KPay的業務占比': '60%', '重複簽約原因': '-', 'NP其他文檔': 'np_docs.zip', '商铺描述': '旗舰门店', '官网 / App Store URL': 'https://shop.demo', '商戶營業狀態（商铺口徑）': '营业中' },
      contact: { '商铺电话': '+852 2123 8888', '手提电话': '+852 6123 8888', '管理员电邮': 'admin@shop.demo', '运营电邮': 'ops@shop.demo', '接收营销资讯': '是', '微信ID': 'shop-tst', '商铺电话类型': '门店前台', '对外联系窗口名称': '门店客服' },
      address: { '门店地址（原始全文）': '香港尖沙咀海港城 3F 301', '门店地址-街道': '海港城', '门店地址-补充地址': '3F 301', '门店地址-城市': 'Hong Kong', '门店地址-州 / 省': '-', '门店地址-邮编': '999077', '门店地址-国家': 'HK', '英文门店地址': '3F 301, Harbour City, Hong Kong', '营业地址（原始全文）': '同门店地址', '营业地址-街道': '海港城', '营业地址-补充地址': '3F 301', '营业地址-城市': 'Hong Kong', '营业地址-州 / 省': '-', '营业地址-邮编': '999077', '营业地址-国家': 'HK', '收机地址': '同门店地址', '邮寄地址': '香港尖沙咀邮政信箱 1001' },
      files: { '门头照片': 'head_sign.jpg', '店内环境照片': 'indoor.jpg', '收银台照片': 'counter.jpg', '营业场所证明': 'business_proof.pdf', '租赁合同 / 场地证明': 'lease_contract.pdf', '地址证明文件': 'address_proof.pdf', '退货政策截图': 'return_policy.png', '菜单 / 商品清单 / 服务清单': 'menu.pdf', '入货单': 'invoice.pdf', '闭路电视录影': 'cctv.zip', '最高交易金额的客户单据': 'max_order.pdf', '其他补充文件': '-' },
      risk: { '風控類型': '标准', '風險等級': '低', '風險評估報告': 'risk_report.pdf', '審核類型': '新建审核', '上單來源': 'CRM', '服務類型': '线下收单', '合作夥伴推薦人': 'Tom Lee', '合作夥伴編號': 'PT-2201', '交單備註': '资料完整', '是否高額商戶': '否' },
      storeTerminal: { 'Store ID': 'STORE-90001', 'Store Reference': 'ST-REF-10001', 'Store Status': 'Pending', 'Sales Channel': 'POS', 'Store Description': 'TST flagship', '终端设备数量': '6', '已绑定终端数量': '4', '可回收终端数量': '1', '最近设备更新时间': '2026-04-10 11:30:00' }
    },
    afpStoreSummary: { id: 'ST_AFP_90001', reference: 'ST_REF_90001', shopperStatement: 'KPay TST Store' },
    afpStoreDetail: [
      { afpField: 'id', value: 'ST_AFP_90001', sourceField: 'Store ID' },
      { afpField: 'reference', value: 'ST_REF_90001', sourceField: 'Store Reference' },
      { afpField: 'description', value: 'TST flagship', sourceField: 'Store Description' },
      { afpField: 'shopperStatement', value: 'KPay TST Store', sourceField: '收据显示名称' },
      { afpField: 'status', value: 'active', sourceField: 'Store Status' },
      { afpField: 'salesChannels[]', value: 'pos', sourceField: 'Sales Channel' },
      { afpField: 'address.city', value: 'Hong Kong', sourceField: '门店地址-城市' }
    ],
    afpTerminalSummary: { terminalCount: '6', boundTerminalCount: '4', recyclableTerminalCount: '1' },
    afpTerminalDetail: [
      { afpField: 'terminalId', value: 'V400m-001', sourceField: '设备ID' },
      { afpField: 'terminalModel', value: 'V400m', sourceField: '设备型号' },
      { afpField: 'terminalCategory', value: 'POS', sourceField: '设备分类' },
      { afpField: 'assignmentStatus', value: 'assigned', sourceField: '绑定状态' },
      { afpField: 'bindStatus', value: 'bound', sourceField: '绑定状态' },
      { afpField: 'recycleStatus', value: 'available', sourceField: '可回收状态' },
      { afpField: 'lastUpdatedAt', value: '2026-04-10 11:30:00', sourceField: '最近设备更新时间' }
    ],
    terminalDevices: [{ model: 'V400m', category: 'POS', quantity: 4, bindStatus: '已绑定' }, { model: 'A920', category: 'SmartPOS', quantity: 2, bindStatus: '部分绑定' }],
    relatedEnterprise: [{ name: 'HK Food Group', cid: 'CID-101', enableStatus: '启用', reviewStatus: '审核通过', contact: 'Wong Ken', relation: '所属企业' }],
    relatedMid: [{ mid: 'MID-7701', thirdMid: 'ADY-99311', channel: 'Adyen-AFP', status: 'Active', settlementTag: 'SETTLE-01', updatedAt: '2026-04-10 10:00:00' }],
    timeline: [{ time: '2026-04-01 10:00:00', operator: 'OPS-Lily', target: '商铺', action: '创建', summary: '创建商铺待审核', remark: '-' }]
  }
};

const sectionNav = [
  ['overview', '商铺概览'], ['keys', '商铺主键与关联'], ['names', '商铺名称信息'], ['operation', '商铺主体与经营信息'], ['basic', '商铺基础经营数据'],
  ['contact', '商铺联系信息'], ['address', '商铺地址信息'], ['files', '商铺文件信息'], ['risk', '风控 / 业务信息'], ['storeTerminal', 'Store / Terminal 信息'],
  ['afp', 'AFP 对接信息'], ['devices', '终端设备'], ['enterprise', '关联企业'], ['mid', '关联 MID'], ['timeline', '修改记录时间轴']
] as const;

const ReviewTag = ({ status }: { status: ReviewStatus }) => {
  if (status === '待风控审核') return <Typography.Text style={{ background: '#e4e4e4', border: '1px solid #cfcfcf', padding: '2px 8px', borderRadius: 6 }}>{status}</Typography.Text>;
  const color = status === '审核通过' ? '#52c41a' : status === '审核不通过' ? '#ff4d4f' : '#faad14';
  return <Typography.Text style={{ border: `1px solid ${color}`, color, padding: '2px 8px', borderRadius: 6 }}>{status}</Typography.Text>;
};

const EnableTag = ({ status }: { status: EnableStatus }) => {
  if (!status) return <span>-</span>;
  return <Typography.Text style={{ border: `1px solid ${status === '启用' ? '#52c41a' : '#d9d9d9'}`, color: status === '启用' ? '#389e0d' : '#595959', padding: '2px 8px', borderRadius: 6 }}>{status}</Typography.Text>;
};

export const ShopDetailPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState<ShopDetail>(seed[id] || seed['shop-1']);
  const [active, setActive] = useState('overview');
  const [storeModal, setStoreModal] = useState(false);
  const [terminalModal, setTerminalModal] = useState(false);
  const [comment, setComment] = useState('');
  const [supplement, setSupplement] = useState('');

  useEffect(() => {
    const nodes = sectionNav.map(([k]) => document.getElementById(k)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current?.target.id) setActive(current.target.id);
    }, { rootMargin: '-180px 0px -65% 0px', threshold: [0.1, 0.3, 0.6] });
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [shop.id]);

  const hasNonAfp = (channels: string[]) => channels.some((c) => c !== 'Adyen-AFP');
  const appendTimeline = (record: Omit<TimelineRecord, 'time'>) => {
    setShop((prev) => ({ ...prev, updatedAt: now(), timeline: [{ ...record, time: now() }, ...prev.timeline] }));
  };

  const approveOps = () => {
    setShop((prev) => {
      if (hasNonAfp(prev.channels)) {
        return { ...prev, reviewStatus: '待风控审核', updatedAt: now(), timeline: [{ time: now(), operator: '当前登录用户', target: '商铺', action: '审核通过（OPS）', summary: `流转待风控审核`, remark: comment || '-' }, ...prev.timeline] };
      }
      return { ...prev, reviewStatus: '审核通过', enableStatus: '启用', updatedAt: now(), timeline: [{ time: now(), operator: '当前登录用户', target: '商铺', action: '审核通过（OPS）', summary: '仅AFP，跳过风控并自动启用', remark: comment || '-' }, ...prev.timeline] };
    });
  };

  const approveRisk = () => setShop((prev) => ({ ...prev, reviewStatus: '审核通过', enableStatus: prev.enableStatus ?? '启用', updatedAt: now(), timeline: [{ time: now(), operator: '当前登录用户', target: '商铺', action: '审核通过（风控）', summary: '审核通过并启用', remark: comment || '-' }, ...prev.timeline] }));
  const reject = () => setShop((prev) => ({ ...prev, reviewStatus: '审核不通过', enableStatus: null, updatedAt: now(), timeline: [{ time: now(), operator: '当前登录用户', target: '商铺', action: '审核驳回', summary: '流转审核不通过', remark: comment || '-' }, ...prev.timeline] }));
  const notify = (role: 'OPS' | '风控') => appendTimeline({ operator: '当前登录用户', target: '商铺', action: `通知补件（${role}）`, summary: '状态不变，已记录补件要求', remark: supplement || '-' });
  const toggleEnable = () => setShop((prev) => ({ ...prev, enableStatus: prev.enableStatus === '启用' ? '停用' : '启用', updatedAt: now(), timeline: [{ time: now(), operator: '当前登录用户', target: '商铺', action: prev.enableStatus === '启用' ? '停用' : '启用', summary: '仅变更启用状态', remark: '-' }, ...prev.timeline] }));
  const resubmit = () => setShop((prev) => ({ ...prev, reviewStatus: '待审核', enableStatus: null, updatedAt: now(), timeline: [{ time: now(), operator: '当前登录用户', target: '商铺', action: '重新提交审核', summary: '状态重置为待审核', remark: '-' }, ...prev.timeline] }));

  const actions = useMemo(() => {
    if (shop.reviewStatus === '待审核') {
      return [
        <Button key="edit" onClick={() => navigate(`/shops/${shop.id}/edit`)}>编辑</Button>,
        <Button key="ops-pass" type="primary" onClick={() => Modal.confirm({ title: '审核通过（OPS）', content: <Input.TextArea rows={3} onChange={(e) => setComment(e.target.value)} />, onOk: approveOps })}>审核通过（OPS）</Button>,
        <Button key="reject" danger onClick={() => Modal.confirm({ title: '审核驳回', content: <Input.TextArea rows={3} onChange={(e) => setComment(e.target.value)} />, onOk: reject })}>审核驳回</Button>,
        <Button key="ops-supp" onClick={() => Modal.confirm({ title: '通知补件（OPS）', content: <Input.TextArea rows={4} placeholder="可输入多项补件内容" onChange={(e) => setSupplement(e.target.value)} />, onOk: () => notify('OPS') })}>通知补件（OPS）</Button>
      ];
    }
    if (shop.reviewStatus === '待风控审核') {
      return [
        <Button key="edit" onClick={() => navigate(`/shops/${shop.id}/edit`)}>编辑</Button>,
        <Button key="risk-pass" type="primary" onClick={() => Modal.confirm({ title: '审核通过（风控）', content: <Input.TextArea rows={3} onChange={(e) => setComment(e.target.value)} />, onOk: approveRisk })}>审核通过（风控）</Button>,
        <Button key="reject" danger onClick={() => Modal.confirm({ title: '审核驳回', content: <Input.TextArea rows={3} onChange={(e) => setComment(e.target.value)} />, onOk: reject })}>审核驳回</Button>,
        <Button key="risk-supp" onClick={() => Modal.confirm({ title: '通知补件（风控）', content: <Input.TextArea rows={4} placeholder="可输入多项补件内容" onChange={(e) => setSupplement(e.target.value)} />, onOk: () => notify('风控') })}>通知补件（风控）</Button>
      ];
    }
    if (shop.reviewStatus === '审核通过') {
      return [
        <Button key="edit" onClick={() => navigate(`/shops/${shop.id}/edit`)}>编辑</Button>,
        <Button key="toggle" onClick={() => Modal.confirm({ title: `是否${shop.enableStatus === '启用' ? '停用' : '启用'}该商铺`, okText: '确认', cancelText: '关闭', onOk: toggleEnable })}>{shop.enableStatus === '启用' ? '停用' : '启用'}</Button>
      ];
    }
    return [<Button key="resubmit" type="primary" onClick={resubmit}>重新提交审核</Button>];
  }, [shop, comment, supplement]);

  return (
    <div style={{ width: '100%' }}>
      <Card id="overview" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={18}>
              <Typography.Title level={3} style={{ margin: 0 }}>{shop.name}</Typography.Title>
              <Space wrap>
                <Typography.Text>SID: {shop.sid}</Typography.Text>
                <Typography.Text>所属企业: {shop.enterpriseName} / {shop.cid}</Typography.Text>
                <Typography.Text>Store ID: {shop.storeId}</Typography.Text>
                <EnableTag status={shop.enableStatus} />
                <ReviewTag status={shop.reviewStatus} />
              </Space>
            </Col>
            <Col span={6}>
              <Card size="small">
                <Typography.Text>终端设备数量: {shop.deviceCount}</Typography.Text><br />
                <Typography.Text>MID 数量: {shop.midCount}</Typography.Text><br />
                <Typography.Text>進件通道(必須): {shop.channels.join(', ')}</Typography.Text><br />
                <Typography.Text>上單來源: {shop.source.join(', ')}</Typography.Text><br />
                <Typography.Text>創建時間: {shop.createdAt}</Typography.Text><br />
                <Typography.Text>更新時間: {shop.updatedAt}</Typography.Text>
              </Card>
            </Col>
          </Row>
          <Space wrap>{actions}</Space>
        </Space>
      </Card>

      <div className="detail-section-nav-wrap" style={{ marginBottom: 16 }}>
        <div className="detail-section-nav">
          {sectionNav.map(([k, t]) => (
            <button key={k} type="button" className={`detail-section-nav-item ${active === k ? 'active' : ''}`} onClick={() => document.getElementById(k)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{t}</button>
          ))}
        </div>
      </div>

      {Object.entries(shop.sections).map(([k, section]) => (
        <Card key={k} id={k} title={sectionNav.find((item) => item[0] === k)?.[1]} style={{ marginBottom: 16 }}>
          <Descriptions column={3} bordered size="small" items={Object.entries(section).map(([label, value]) => ({ key: label, label, children: value || '-' }))} />
        </Card>
      ))}

      <Card id="afp" title="AFP 对接信息" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" title="Store 映射信息" extra={<Button size="small" onClick={() => setStoreModal(true)}>查看详情</Button>}>
              <Descriptions column={1} size="small" items={Object.entries(shop.afpStoreSummary).map(([k, v]) => ({ key: k, label: k, children: v }))} />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="Terminal / Device 映射信息" extra={<Button size="small" onClick={() => setTerminalModal(true)}>查看详情</Button>}>
              <Descriptions column={1} size="small" items={Object.entries(shop.afpTerminalSummary).map(([k, v]) => ({ key: k, label: k, children: v }))} />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card id="devices" title="终端设备" style={{ marginBottom: 16 }}>
        <Table rowKey="model" pagination={false} dataSource={shop.terminalDevices} columns={[{ title: '设备型号', dataIndex: 'model' }, { title: '设备分类', dataIndex: 'category' }, { title: '数量', dataIndex: 'quantity' }, { title: '绑定状态', dataIndex: 'bindStatus' }]} />
      </Card>

      <Card id="enterprise" title="关联企业" style={{ marginBottom: 16 }}>
        <Table rowKey="cid" pagination={false} dataSource={shop.relatedEnterprise} columns={[{ title: '企业名称', dataIndex: 'name' }, { title: '企业编号（CID）', dataIndex: 'cid' }, { title: '企业启用状态', dataIndex: 'enableStatus' }, { title: '企业审核状态', dataIndex: 'reviewStatus' }, { title: '主联系人', dataIndex: 'contact' }, { title: '关系说明', dataIndex: 'relation' }, { title: '操作', render: () => <Button type="link">查看详情</Button> }]} />
      </Card>

      <Card id="mid" title="关联 MID" style={{ marginBottom: 16 }}>
        <Table rowKey="mid" pagination={false} dataSource={shop.relatedMid} columns={[{ title: 'MID 编号', dataIndex: 'mid' }, { title: '第三方渠道 MID', dataIndex: 'thirdMid' }, { title: '服务通道', dataIndex: 'channel' }, { title: '当前状态', dataIndex: 'status' }, { title: '结算账号标识', dataIndex: 'settlementTag' }, { title: '更新时间', dataIndex: 'updatedAt' }, { title: '操作', render: () => <Button type="link">查看详情</Button> }]} />
      </Card>

      <Card id="timeline" title="修改记录时间轴" style={{ marginBottom: 16 }}>
        <Timeline items={shop.timeline.map((item) => ({ children: `${item.time} | ${item.operator} | ${item.target} | ${item.action} | ${item.summary} | ${item.remark || '-'}` }))} />
      </Card>

      <Modal open={storeModal} onCancel={() => setStoreModal(false)} onOk={() => setStoreModal(false)} width={980} title="Store 映射详情">
        <Table rowKey="afpField" pagination={false} dataSource={shop.afpStoreDetail} columns={[{ title: 'AFP字段名', dataIndex: 'afpField', width: 280 }, { title: '当前值', dataIndex: 'value', width: 260 }, { title: '来源字段', dataIndex: 'sourceField' }]} scroll={{ y: 420 }} />
      </Modal>

      <Modal open={terminalModal} onCancel={() => setTerminalModal(false)} onOk={() => setTerminalModal(false)} width={980} title="Terminal / Device 映射详情">
        <Table rowKey="afpField" pagination={false} dataSource={shop.afpTerminalDetail} columns={[{ title: 'AFP字段名', dataIndex: 'afpField', width: 280 }, { title: '当前值', dataIndex: 'value', width: 260 }, { title: '来源字段', dataIndex: 'sourceField' }]} scroll={{ y: 420 }} />
      </Modal>

      <Divider />
    </div>
  );
};
