import { Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ShopReviewStatus = '待审核' | '待风控审核' | '审核通过' | '审核不通过';
type ShopEnableStatus = '启用' | '停用' | null;

interface ShopRow {
  id: string;
  nameLocal: string;
  nameEn: string;
  sid: string;
  enterpriseName: string;
  cid: string;
  region: string;
  shopType: string;
  enableStatus: ShopEnableStatus;
  reviewStatus: ShopReviewStatus;
  channels: string[];
  phone: string;
  email: string;
  country: string;
  businessLocation: string;
  addressRaw: string;
  specialTags: string[];
  source: string[];
  creator: string;
  createdAt: string;
  updatedAt: string;
}

const mockShopList: ShopRow[] = [
  { id: 'shop-1', nameLocal: '尖沙咀旗舰店', nameEn: 'TST Flagship Store', sid: 'SID-10001', enterpriseName: 'HK Food Group', cid: 'CID-101', region: 'HK', shopType: '线下门店', enableStatus: null, reviewStatus: '待审核', channels: ['Adyen-AFP'], phone: '+852 2123 8888', email: 'tst@shop.demo', country: 'HK', businessLocation: '商場', addressRaw: '香港尖沙咀海港城 3F 301', specialTags: ['旅游商圈'], source: ['CRM'], creator: 'OPS-Lily', createdAt: '2026-04-01 10:00:00', updatedAt: '2026-04-01 10:00:00' },
  { id: 'shop-2', nameLocal: '旺角站前店', nameEn: 'Mong Kok Transit Shop', sid: 'SID-10002', enterpriseName: 'HK Food Group', cid: 'CID-101', region: 'HK', shopType: '线下门店', enableStatus: null, reviewStatus: '待风控审核', channels: ['Adyen-payfac'], phone: '+852 2123 7777', email: 'mk@shop.demo', country: 'HK', businessLocation: '地鋪', addressRaw: '香港旺角弥敦道 678 号', specialTags: ['夜市'], source: ['DMO'], creator: 'DMO', createdAt: '2026-04-02 11:00:00', updatedAt: '2026-04-03 16:30:00' },
  { id: 'shop-3', nameLocal: '中环金融中心店', nameEn: 'Central IFC Store', sid: 'SID-10003', enterpriseName: 'Approved Active Co', cid: 'CID-104', region: 'HK', shopType: '线下门店', enableStatus: '启用', reviewStatus: '审核通过', channels: ['Adyen-AFP'], phone: '+852 2123 6666', email: 'ifc@shop.demo', country: 'HK', businessLocation: '商場', addressRaw: '香港中环 IFC Mall L2', specialTags: ['高客单'], source: ['CRM'], creator: 'OPS-May', createdAt: '2026-03-20 09:00:00', updatedAt: '2026-04-10 14:20:00' },
  { id: 'shop-4', nameLocal: '铜锣湾时代广场店', nameEn: 'Causeway Bay Times Square', sid: 'SID-10004', enterpriseName: 'Approved Disabled Co', cid: 'CID-105', region: 'HK', shopType: '线下门店', enableStatus: '停用', reviewStatus: '审核通过', channels: ['Adyen-AFP', 'Adyen-payfac'], phone: '+852 2123 5555', email: 'cwb@shop.demo', country: 'HK', businessLocation: '商場', addressRaw: '香港铜锣湾时代广场 B1', specialTags: ['混合通道'], source: ['SaaS'], creator: 'SaaS', createdAt: '2026-03-18 08:30:00', updatedAt: '2026-04-11 10:15:00' },
  { id: 'shop-5', nameLocal: '观塘网店', nameEn: 'Kwun Tong Online Store', sid: 'SID-10005', enterpriseName: 'Rejected Corp', cid: 'CID-106', region: 'HK', shopType: '网店', enableStatus: null, reviewStatus: '审核不通过', channels: ['Other'], phone: '+852 2123 4444', email: 'online@shop.demo', country: 'HK', businessLocation: '網店(只限Online）', addressRaw: 'https://online.shop.demo', specialTags: ['线上'], source: ['CRM'], creator: 'OPS-Jen', createdAt: '2026-04-05 12:00:00', updatedAt: '2026-04-08 18:20:00' },
  { id: 'shop-6', nameLocal: '荃湾地库店', nameEn: 'Tsuen Wan Basement Store', sid: 'SID-10006', enterpriseName: 'Multi Channel Mixed', cid: 'CID-108', region: 'HK', shopType: '线下门店', enableStatus: null, reviewStatus: '待审核', channels: ['Adyen-AFP', 'Adyen-payfac'], phone: '+852 2123 3333', email: 'tw@shop.demo', country: 'HK', businessLocation: '地庫', addressRaw: '荃湾地铁站 B2', specialTags: ['餐饮'], source: ['其他'], creator: 'OPS-Ken', createdAt: '2026-04-06 13:00:00', updatedAt: '2026-04-06 13:00:00' }
];

const coreFilterLabels = ['商铺名称关键词', '地区', '商铺启用状态', '商铺审核状态', '服务通道', '创建时间'];

const ReviewTag = ({ status }: { status: ShopReviewStatus }) => {
  if (status === '待风控审核') return <Tag style={{ background: '#e4e4e4', borderColor: '#cfcfcf', color: '#1f2937' }}>{status}</Tag>;
  const color = status === '审核通过' ? 'success' : status === '审核不通过' ? 'error' : 'warning';
  return <Tag color={color}>{status}</Tag>;
};

const EnableTag = ({ status }: { status: ShopEnableStatus }) => {
  if (!status) return <span>-</span>;
  return <Tag color={status === '启用' ? 'green' : 'default'}>{status}</Tag>;
};

export const ShopListPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [rows, setRows] = useState<ShopRow[]>(mockShopList);
  const navigate = useNavigate();

  const filters = useMemo(() => [
    { label: '商铺名称关键词', node: <Input placeholder="商铺名称/简称/英文名" /> },
    { label: '地区', node: <Select options={[{ value: 'HK' }, { value: 'SG' }]} /> },
    { label: '商铺启用状态', node: <Select options={[{ value: '启用' }, { value: '停用' }]} /> },
    { label: '商铺审核状态', node: <Select options={[{ value: '待审核' }, { value: '待风控审核' }, { value: '审核通过' }, { value: '审核不通过' }]} /> },
    { label: '服务通道', node: <Select mode="multiple" options={[{ value: 'Adyen-AFP' }, { value: 'Adyen-payfac' }, { value: 'Other' }]} /> },
    { label: '创建时间', node: <DatePicker.RangePicker style={{ width: '100%' }} /> },
    { label: '商铺编号', node: <Input /> },
    { label: '上單來源', node: <Select mode="multiple" options={[{ value: 'CRM' }, { value: 'DMO' }, { value: 'SaaS' }, { value: '其他' }]} /> },
    { label: '所属企业编号', node: <Input /> },
    { label: '營業鋪位', node: <Select options={[{ value: '地鋪' }, { value: '樓上' }, { value: '地庫' }, { value: '商場' }, { value: '活動' }, { value: '網店(只限Online）' }, { value: '其他' }]} /> },
    { label: '联系电话', node: <Input /> },
    { label: '电邮地址', node: <Input /> }
  ], []);

  const displayFilters = expanded ? filters : filters.filter((f) => coreFilterLabels.includes(f.label));

  const toggleEnable = (id: string, next: '启用' | '停用') => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, enableStatus: next } : row)));
  };

  const resubmit = (id: string) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, reviewStatus: '待审核', enableStatus: null } : row)));
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>商铺管理</Typography.Title>

      <Card>
        <Form layout="vertical">
          <Row gutter={16}>
            {displayFilters.map((f) => (
              <Col span={8} key={f.label}><Form.Item label={f.label}>{f.node}</Form.Item></Col>
            ))}
            {!expanded && Array.from({ length: 6 - displayFilters.length }).map((_, i) => <Col key={`shop-gap-${i}`} span={8} />)}
            <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space>
                <Button type="primary">查询</Button>
                <Button>重置</Button>
                <Button type="link" onClick={() => setExpanded((v) => !v)}>{expanded ? '收起' : '展开'}</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card bodyStyle={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <Typography.Title level={5} style={{ margin: 0 }}>商铺列表</Typography.Title>
          <Space><Button>导出</Button><Button>导入</Button><Button type="primary" onClick={() => navigate("/shops/new")}>新增</Button></Space>
        </div>
        <Table rowKey="id" dataSource={rows} pagination={{ pageSize: 8 }} scroll={{ x: 3800 }} columns={[
          { title: '商铺名称（本地语言）', dataIndex: 'nameLocal', width: 360, render: (v) => <Tooltip title={v}><Typography.Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>{v}</Typography.Paragraph></Tooltip> },
          { title: '商铺名称（英文）', dataIndex: 'nameEn', width: 320, render: (v) => <Tooltip title={v}><Typography.Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>{v}</Typography.Paragraph></Tooltip> },
          { title: '商铺编号（SID）', dataIndex: 'sid', width: 180 },
          { title: '所属企业名称', dataIndex: 'enterpriseName', width: 280 },
          { title: '所属企业编号（CID）', dataIndex: 'cid', width: 200 },
          { title: '地区', dataIndex: 'region', width: 140 },
          { title: '商铺类型', dataIndex: 'shopType', width: 180 },
          { title: '商铺启用状态', dataIndex: 'enableStatus', width: 160, render: (v) => <EnableTag status={v} /> },
          { title: '商铺审核状态', dataIndex: 'reviewStatus', width: 160, render: (v) => <ReviewTag status={v} /> },
          { title: '服务通道', dataIndex: 'channels', width: 220, render: (v: string[]) => v.join(', ') },
          { title: '门店联系电话', dataIndex: 'phone', width: 180 },
          { title: '门店联系邮箱', dataIndex: 'email', width: 220 },
          { title: '营业国家', dataIndex: 'country', width: 180 },
          { title: '營業鋪位', dataIndex: 'businessLocation', width: 200 },
          { title: '门店营业地址（原始全文）', dataIndex: 'addressRaw', width: 300, render: (v) => <Tooltip title={v}><Typography.Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>{v}</Typography.Paragraph></Tooltip> },
          { title: '特殊业务属性标签', dataIndex: 'specialTags', width: 220, render: (v: string[]) => v.map((i) => <Tag key={i}>{i}</Tag>) },
          { title: '上單來源', dataIndex: 'source', width: 180, render: (v: string[]) => v.join(', ') },
          { title: '创建人', dataIndex: 'creator', width: 160 },
          { title: '创建时间', dataIndex: 'createdAt', width: 200 },
          { title: '更新时间', dataIndex: 'updatedAt', width: 200 },
          {
            title: '操作', key: 'action', width: 180, fixed: 'right', render: (_, row) => (
              <Space direction="vertical" align="start">
                <Button type="link" onClick={() => navigate(`/shops/${row.id}`)}>查看详情</Button>
                {row.reviewStatus === '审核通过' && <Button type="link" onClick={() => navigate(`/shops/${row.id}/edit`)}>编辑</Button>}
                {row.reviewStatus === '审核通过' && (
                  <Button
                    type="link"
                    onClick={() =>
                      Modal.confirm({
                        title: `是否${row.enableStatus === '启用' ? '停用' : '启用'}该商铺`,
                        okText: '确认',
                        cancelText: '关闭',
                        onOk: () => toggleEnable(row.id, row.enableStatus === '启用' ? '停用' : '启用')
                      })
                    }
                  >
                    {row.enableStatus === '启用' ? '停用' : '启用'}
                  </Button>
                )}
                {row.reviewStatus === '审核不通过' && <Button type="link" onClick={() => resubmit(row.id)}>重新提交审核</Button>}
              </Space>
            )
          }
        ]} />
      </Card>
    </Space>
  );
};
