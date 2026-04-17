import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type MerchantSignedStatus = '已签约' | '取消签约' | '拒绝签约';

interface MerchantStatusRow {
  id: string;
  mid: string;
  cid: string;
  enterpriseName: string;
  sid: string;
  shopName: string;
  channelCodes: string[];
  serviceCodes: string[];
  intakeChannel: string;
  reviewStatus: MerchantSignedStatus;
  currentReviewer: string;
  products: string[];
  source: string[];
  creator: string;
  createdAt: string;
  updatedAt: string;
}

const collapsedFields = ['MID', '商户审核状态', 'CID', 'SID', '渠道编码', '创建时间'];

const statusStyleMap: Record<MerchantSignedStatus, CSSProperties> = {
  已签约: { background: '#F6FFED', borderColor: '#B7EB8F', color: '#237804' },
  取消签约: { background: '#FFF1F0', borderColor: '#FFA39E', color: '#CF1322' },
  拒绝签约: { background: '#FFF1F0', borderColor: '#FF7875', color: '#A8071A' }
};

const rowsByStatus: Record<MerchantSignedStatus, MerchantStatusRow[]> = {
  已签约: [
    {
      id: 'm-s-1',
      mid: 'MID-S001',
      cid: 'CID-201',
      enterpriseName: 'Signed Group Ltd',
      sid: 'SID-21001',
      shopName: '中环总店',
      channelCodes: ['ADY_AFP'],
      serviceCodes: ['POS_CORE'],
      intakeChannel: 'Adyen-AFP',
      reviewStatus: '已签约',
      currentReviewer: 'System',
      products: ['POS'],
      source: ['CRM'],
      creator: 'OPS-Lily',
      createdAt: '2026-04-10 10:00:00',
      updatedAt: '2026-04-11 11:00:00'
    }
  ],
  取消签约: [
    {
      id: 'm-c-1',
      mid: 'MID-C001',
      cid: 'CID-202',
      enterpriseName: 'Cancelled Commerce',
      sid: 'SID-22001',
      shopName: '铜锣湾分店',
      channelCodes: ['ADY_AFP'],
      serviceCodes: ['POS_CORE'],
      intakeChannel: 'Adyen-AFP',
      reviewStatus: '取消签约',
      currentReviewer: 'OPS-Ryan',
      products: ['POS'],
      source: ['DMO'],
      creator: 'DMO',
      createdAt: '2026-04-09 09:10:00',
      updatedAt: '2026-04-11 16:20:00'
    }
  ],
  拒绝签约: [
    {
      id: 'm-r-1',
      mid: 'MID-R001',
      cid: 'CID-203',
      enterpriseName: 'Rejected Merchant Inc',
      sid: 'SID-23001',
      shopName: '葵涌网店',
      channelCodes: ['ADY_PAYFAC'],
      serviceCodes: ['POS_CORE'],
      intakeChannel: 'Adyen-payfac',
      reviewStatus: '拒绝签约',
      currentReviewer: 'Risk-Ken',
      products: ['POS'],
      source: ['SaaS'],
      creator: 'SaaS',
      createdAt: '2026-04-08 13:30:00',
      updatedAt: '2026-04-11 17:00:00'
    }
  ]
};

const statusTag = (status: MerchantSignedStatus) => <Tag style={statusStyleMap[status]}>{status}</Tag>;

const renderText = (value?: string) => (
  <Tooltip title={value}>
    <Typography.Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>{value || '-'}</Typography.Paragraph>
  </Tooltip>
);

export const MerchantStatusListPage = ({ status }: { status: MerchantSignedStatus }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const filters = useMemo(() => [
    { label: 'MID', node: <Input /> },
    { label: '商户审核状态', node: <Select value={status} options={[{ value: status }]} disabled /> },
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
  ], [status]);

  const visibleFilters = expanded ? filters : filters.filter((f) => collapsedFields.includes(f.label));

  const rows = rowsByStatus[status];

  const renderActions = (row: MerchantStatusRow) => {
    const detailBtn = <Button key="detail" type="link" onClick={() => navigate(`/merchants/${row.id}`, { state: { merchantStatus: row.reviewStatus } })}>详情</Button>;
    if (status === '已签约') {
      return [
        <Button key="detail-traditional" type="link" onClick={() => navigate(`/merchants/${row.id}`, { state: { merchantStatus: row.reviewStatus } })}>詳情</Button>,
        <Button key="kfund" type="link">KFund訂單狀態</Button>,
        <Button key="edit" type="link" onClick={() => navigate(`/merchants/${row.id}/edit`)}>修改</Button>,
        <Button key="freeze" type="link">凍結商戶</Button>,
        <Button key="export" type="link">导出</Button>,
        <Button key="kpay" type="link">KPay分店列表</Button>,
        <Button key="relation" type="link">相关商戶管理</Button>
      ];
    }
    return [detailBtn];
  };

  const columns: ColumnsType<MerchantStatusRow> = [
    { title: 'MID', dataIndex: 'mid', width: 160, render: (v: string) => <Typography.Text copyable>{v}</Typography.Text> },
    { title: 'CID', dataIndex: 'cid', width: 160, render: (v: string) => <Typography.Text copyable>{v}</Typography.Text> },
    { title: '企业名称', dataIndex: 'enterpriseName', width: 260, render: (v: string) => renderText(v) },
    { title: 'SID', dataIndex: 'sid', width: 160, render: (v: string) => <Typography.Text copyable>{v}</Typography.Text> },
    { title: '商铺名称', dataIndex: 'shopName', width: 260, render: (v: string) => renderText(v) },
    { title: '渠道编码', dataIndex: 'channelCodes', width: 200, render: (v: string[]) => v.join(', ') },
    { title: '服务编码', dataIndex: 'serviceCodes', width: 220, render: (v: string[]) => v.join(', ') },
    { title: '进件通道', dataIndex: 'intakeChannel', width: 180, render: (v: string) => renderText(v) },
    { title: '商户审核状态', dataIndex: 'reviewStatus', width: 180, render: (v: MerchantSignedStatus) => statusTag(v) },
    { title: '当前审核人', dataIndex: 'currentReviewer', width: 180, render: (v: string) => renderText(v) },
    { title: '產品開通', dataIndex: 'products', width: 180, render: (v: string[]) => v.join(', ') },
    { title: '上單來源', dataIndex: 'source', width: 180, render: (v: string[]) => v.join(', ') },
    { title: '创建人', dataIndex: 'creator', width: 160, render: (v: string) => renderText(v) },
    { title: '创建时间', dataIndex: 'createdAt', width: 190, render: (v: string) => renderText(v) },
    { title: '更新时间', dataIndex: 'updatedAt', width: 190, render: (v: string) => renderText(v) },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_: unknown, row: MerchantStatusRow) => (
        <Space direction="vertical" align="start">
          {renderActions(row).map((btn, idx) => <span key={idx}>{btn}</span>)}
        </Space>
      )
    }
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>{status}商户</Typography.Title>
        <Typography.Text type="secondary">{status}状态商户列表</Typography.Text>
      </div>

      <Card>
        <Form layout="vertical">
          <Row gutter={16}>
            {visibleFilters.map((f) => (
              <Col span={8} key={f.label}><Form.Item label={f.label}>{f.node}</Form.Item></Col>
            ))}
            {!expanded && Array.from({ length: 6 - visibleFilters.length }).map((_, i) => <Col key={`merchant-status-gap-${i}`} span={8} />)}
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
          <Typography.Title level={5} style={{ margin: 0 }}>{status}商户列表</Typography.Title>
          <Space><Button>导出</Button><Button>导入</Button></Space>
        </div>

        <Table rowKey="id" dataSource={rows} pagination={{ pageSize: 10 }} scroll={{ x: 3000 }} columns={columns} />
      </Card>
    </Space>
  );
};
