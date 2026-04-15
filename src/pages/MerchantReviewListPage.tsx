import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { type CSSProperties, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type MerchantReviewStatus =
  | '待审核'
  | '基础资料审核'
  | '销售主管审核'
  | '风控核查'
  | '风控初级审核'
  | '风控中级审核'
  | '总经理审核'
  | '风控审核完成';

interface MerchantRow {
  id: string;
  mid: string;
  cid: string;
  enterpriseName: string;
  sid: string;
  shopName: string;
  channelCodes: string[];
  serviceCodes: string[];
  intakeChannel: string;
  reviewStatus: MerchantReviewStatus;
  riskCheckStage?: 1 | 2;
  currentReviewer: string;
  products: string[];
  source: string[];
  creator: string;
  createdAt: string;
  updatedAt: string;
}

const reviewStatusOptions: MerchantReviewStatus[] = ['待审核', '基础资料审核', '销售主管审核', '风控核查', '风控初级审核', '风控中级审核', '总经理审核', '风控审核完成'];

const mockMerchants: MerchantRow[] = [
  { id: 'm-1', mid: 'MID-001', cid: 'CID-101', enterpriseName: 'HK Food Group', sid: 'SID-10001', shopName: '尖沙咀旗舰店', channelCodes: ['ADY_AFP'], serviceCodes: ['POS_CORE'], intakeChannel: 'Adyen-AFP', reviewStatus: '待审核', currentReviewer: '-', products: ['POS'], source: ['CRM'], creator: 'OPS-Lily', createdAt: '2026-04-01 10:00:00', updatedAt: '2026-04-01 10:00:00' },
  { id: 'm-2', mid: 'MID-002', cid: 'CID-101', enterpriseName: 'HK Food Group', sid: 'SID-10002', shopName: '旺角站前店', channelCodes: ['ADY_PAYFAC'], serviceCodes: ['POS_CORE', 'POS_EXT'], intakeChannel: 'Adyen-payfac', reviewStatus: '基础资料审核', currentReviewer: 'OPS-Ryan', products: ['POS', 'Settlement'], source: ['DMO'], creator: 'DMO', createdAt: '2026-04-02 12:00:00', updatedAt: '2026-04-03 15:00:00' },
  { id: 'm-3', mid: 'MID-003', cid: 'CID-104', enterpriseName: 'Approved Active Co', sid: 'SID-10003', shopName: '中环金融中心店', channelCodes: ['ADY_PAYFAC'], serviceCodes: ['POS_CORE'], intakeChannel: 'Adyen-payfac', reviewStatus: '销售主管审核', currentReviewer: 'Sales-Mary', products: ['POS'], source: ['SaaS'], creator: 'SaaS', createdAt: '2026-04-04 08:30:00', updatedAt: '2026-04-04 09:30:00' },
  { id: 'm-4', mid: 'MID-004', cid: 'CID-105', enterpriseName: 'Approved Disabled Co', sid: 'SID-10004', shopName: '铜锣湾时代广场店', channelCodes: ['ADY_PAYFAC'], serviceCodes: ['POS_CORE'], intakeChannel: 'Adyen-payfac', reviewStatus: '风控核查', riskCheckStage: 1, currentReviewer: '-', products: ['POS'], source: ['CRM'], creator: 'OPS-May', createdAt: '2026-04-05 08:30:00', updatedAt: '2026-04-05 09:20:00' },
  { id: 'm-5', mid: 'MID-005', cid: 'CID-106', enterpriseName: 'Rejected Corp', sid: 'SID-10005', shopName: '观塘网店', channelCodes: ['OTHER'], serviceCodes: ['POS_CORE'], intakeChannel: 'Other', reviewStatus: '风控核查', riskCheckStage: 2, currentReviewer: 'Risk-Ken', products: ['POS'], source: ['其他'], creator: 'OPS-Jen', createdAt: '2026-04-06 11:30:00', updatedAt: '2026-04-06 12:40:00' },
  { id: 'm-6', mid: 'MID-006', cid: 'CID-108', enterpriseName: 'Multi Channel Mixed', sid: 'SID-10006', shopName: '荃湾地库店', channelCodes: ['ADY_PAYFAC'], serviceCodes: ['POS_CORE'], intakeChannel: 'Adyen-payfac', reviewStatus: '风控初级审核', currentReviewer: 'Risk-Junior', products: ['POS'], source: ['CRM'], creator: 'OPS-Ken', createdAt: '2026-04-07 13:00:00', updatedAt: '2026-04-07 14:00:00' },
  { id: 'm-7', mid: 'MID-007', cid: 'CID-108', enterpriseName: 'Multi Channel Mixed', sid: 'SID-10006', shopName: '荃湾地库店', channelCodes: ['ADY_PAYFAC'], serviceCodes: ['POS_CORE'], intakeChannel: 'Adyen-payfac', reviewStatus: '风控中级审核', currentReviewer: 'Risk-Senior', products: ['POS'], source: ['CRM'], creator: 'OPS-Ken', createdAt: '2026-04-07 15:00:00', updatedAt: '2026-04-07 16:20:00' },
  { id: 'm-8', mid: 'MID-008', cid: 'CID-101', enterpriseName: 'HK Food Group', sid: 'SID-10001', shopName: '尖沙咀旗舰店', channelCodes: ['ADY_AFP'], serviceCodes: ['POS_CORE'], intakeChannel: 'Adyen-AFP', reviewStatus: '总经理审核', currentReviewer: 'GM-Anna', products: ['POS', 'Settlement'], source: ['CRM'], creator: 'OPS-Lily', createdAt: '2026-04-08 09:00:00', updatedAt: '2026-04-08 09:40:00' },
  { id: 'm-9', mid: 'MID-009', cid: 'CID-101', enterpriseName: 'HK Food Group', sid: 'SID-10002', shopName: '旺角站前店', channelCodes: ['ADY_AFP'], serviceCodes: ['POS_CORE'], intakeChannel: 'Adyen-AFP', reviewStatus: '风控审核完成', currentReviewer: 'System', products: ['POS'], source: ['DMO'], creator: 'DMO', createdAt: '2026-04-09 10:30:00', updatedAt: '2026-04-09 11:10:00' }
];

const collapsedFields = ['MID', '商户审核状态', 'CID', 'SID', '渠道编码', '创建时间'];

const statusTag = (status: MerchantReviewStatus) => {
  const styleMap: Record<MerchantReviewStatus, CSSProperties> = {
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

export const MerchantReviewListPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [rows] = useState<MerchantRow[]>(mockMerchants);
  const navigate = useNavigate();

  const filters = useMemo(() => [
    { label: 'MID', node: <Input /> },
    { label: '商户审核状态', node: <Select options={reviewStatusOptions.map((v) => ({ value: v }))} /> },
    { label: 'CID', node: <Input /> },
    { label: 'SID', node: <Input /> },
    { label: '渠道编码', node: <Select mode="multiple" options={[{ value: 'ADY_AFP' }, { value: 'ADY_PAYFAC' }, { value: 'OTHER' }]} /> },
    { label: '创建时间', node: <DatePicker.RangePicker style={{ width: '100%' }} /> },
    { label: '服务编码', node: <Select mode="multiple" options={[{ value: 'POS_CORE' }, { value: 'POS_EXT' }, { value: 'SETTLE' }]} /> },
    { label: '上單來源', node: <Select mode="multiple" options={[{ value: 'CRM' }, { value: 'DMO' }, { value: 'SaaS' }, { value: '其他' }]} /> },
    { label: 'AFP Store ID', node: <Input /> },
    { label: 'AFP merchant account ID', node: <Input /> },
    { label: 'AFP Store状态', node: <Select options={[{ value: 'active' }, { value: 'inactive' }, { value: 'pending' }]} /> },
    { label: '使用費率模板', node: <Input /> },
    { label: '結算幣種', node: <Select options={[{ value: 'HKD' }, { value: 'USD' }, { value: 'SGD' }]} /> },
    { label: '產品開通', node: <Select mode="multiple" options={[{ value: 'POS' }, { value: 'Settlement' }, { value: 'Online' }]} /> }
  ], []);

  const visibleFilters = expanded ? filters : filters.filter((f) => collapsedFields.includes(f.label));

  const renderActions = (row: MerchantRow) => {
    const common = [<Button key="detail" type="link" onClick={() => navigate(`/merchants/${row.id}`)}>查看详情</Button>];
    if (row.reviewStatus === '待审核') return [...common, <Button key="export" type="link">一键导出</Button>, <Button key="assign" type="link">分配</Button>, <Button key="kpay" type="link">Kpay分店列表</Button>];
    if (row.reviewStatus === '基础资料审核') return [...common, <Button key="export" type="link">一键导出</Button>, <Button key="transfer" type="link">转派</Button>, <Button key="kpay" type="link">Kpay分店列表</Button>];
    if (row.reviewStatus === '风控核查' || row.reviewStatus === '风控初级审核' || row.reviewStatus === '风控中级审核') return [...common, <Button key="export" type="link">一键导出</Button>, <Button key="kpay" type="link">Kpay分店列表</Button>];
    if (row.reviewStatus === '总经理审核' || row.reviewStatus === '风控审核完成') return common;
    return common;
  };

  const renderText = (value?: string) => (
    <Tooltip title={value}>
      <Typography.Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>{value || '-'}</Typography.Paragraph>
    </Tooltip>
  );

  const columns: ColumnsType<MerchantRow> = [
    { title: 'MID', dataIndex: 'mid', width: 160, render: (v: string) => <Typography.Text copyable>{v}</Typography.Text> },
    { title: 'CID', dataIndex: 'cid', width: 160, render: (v: string) => <Typography.Text copyable>{v}</Typography.Text> },
    { title: '企业名称', dataIndex: 'enterpriseName', width: 260, render: (v: string) => renderText(v) },
    { title: 'SID', dataIndex: 'sid', width: 160, render: (v: string) => <Typography.Text copyable>{v}</Typography.Text> },
    { title: '商铺名称', dataIndex: 'shopName', width: 260, render: (v: string) => renderText(v) },
    { title: '渠道编码', dataIndex: 'channelCodes', width: 200, render: (v: string[]) => v.join(', ') },
    { title: '服务编码', dataIndex: 'serviceCodes', width: 220, render: (v: string[]) => v.join(', ') },
    { title: '进件通道', dataIndex: 'intakeChannel', width: 180, render: (v: string) => renderText(v) },
    { title: '商户审核状态', dataIndex: 'reviewStatus', width: 180, render: (v: MerchantReviewStatus) => statusTag(v) },
    { title: '当前审核人', dataIndex: 'currentReviewer', width: 180, render: (v: string) => renderText(v) },
    { title: '產品開通', dataIndex: 'products', width: 180, render: (v: string[]) => v.join(', ') },
    { title: '上單來源', dataIndex: 'source', width: 180, render: (v: string[]) => v.join(', ') },
    { title: '创建人', dataIndex: 'creator', width: 160, render: (v: string) => renderText(v) },
    { title: '创建时间', dataIndex: 'createdAt', width: 190, render: (v: string) => renderText(v) },
    { title: '更新时间', dataIndex: 'updatedAt', width: 190, render: (v: string) => renderText(v) },
    {
      title: '操作', key: 'action', width: 220, fixed: 'right', render: (_: unknown, row: MerchantRow) => (
        <Space direction="vertical" align="start">
          {renderActions(row).map((btn, idx) => <span key={idx}>{btn}</span>)}
        </Space>
      )
    }
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>商户审核</Typography.Title>
        <Typography.Text type="secondary">审核中的商户（MID）列表</Typography.Text>
      </div>

      <Card>
        <Form layout="vertical">
          <Row gutter={16}>
            {visibleFilters.map((f) => (
              <Col span={8} key={f.label}><Form.Item label={f.label}>{f.node}</Form.Item></Col>
            ))}
            {!expanded && Array.from({ length: 6 - visibleFilters.length }).map((_, i) => <Col key={`merchant-gap-${i}`} span={8} />)}
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
          <Typography.Title level={5} style={{ margin: 0 }}>商户审核列表</Typography.Title>
          <Space><Button>导出</Button><Button>导入</Button></Space>
        </div>

        <Table rowKey="id" dataSource={rows} pagination={{ pageSize: 10 }} scroll={{ x: 3000 }} columns={columns} />
      </Card>
    </Space>
  );
};
