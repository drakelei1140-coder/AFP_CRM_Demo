import { Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Table, Tooltip, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnableTag, ReviewTag } from '../components/StatusTag';
import { useEnterpriseStore } from '../store/enterpriseStore';

const coreFields = ['名称关键词', '地区', '企业启用状态', '企业审核状态', '服务通道', '创建时间'];

export const EnterpriseListPage = () => {
  const { enterprises, updateEnableStatus, resubmit } = useEnterpriseStore();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const filters = useMemo(() => [
    { label: '名称关键词', node: <Input placeholder="企业名称/简称/英文名" /> },
    { label: '地区', node: <Select options={[{ value: 'HK' }, { value: 'SG' }]} /> },
    { label: '企业启用状态', node: <Select options={[{ value: '启用' }, { value: '停用' }]} /> },
    { label: '企业审核状态', node: <Select options={[{ value: '待审核' }, { value: '待风控审核' }, { value: '审核通过' }, { value: '审核不通过' }]} /> },
    { label: '服务通道', node: <Select mode="multiple" options={[{ value: 'Adyen-AFP' }, { value: 'Adyen-payfac' }, { value: 'Other' }]} /> },
    { label: '创建时间', node: <DatePicker.RangePicker style={{ width: '100%' }} /> },
    { label: '上單來源', node: <Select mode="multiple" options={[{ value: 'CRM' }, { value: 'DMO' }, { value: 'SaaS' }, { value: 'Other' }]} /> },
    { label: '公司模式', node: <Select options={[{ value: '直营' }, { value: '加盟' }, { value: '连锁' }, { value: '其他' }]} /> },
    { label: '法律地位', node: <Select options={[{ value: '个人' }, { value: '个体工商户' }, { value: '有限公司' }, { value: '股份有限公司' }, { value: '合伙企业' }, { value: '非营利组织' }, { value: '其他' }]} /> },
    { label: '成立时间', node: <DatePicker.RangePicker style={{ width: '100%' }} /> },
    { label: '公司电话', node: <Input /> },
    { label: '电邮地址', node: <Input /> }
  ], []);

  const showing = expanded ? filters : filters.filter((x) => coreFields.includes(x.label));

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>企业管理</Typography.Title>
      <Card>
        <Form layout="vertical">
          <Row gutter={16}>
            {showing.map((f) => (
              <Col span={8} key={f.label}><Form.Item label={f.label}>{f.node}</Form.Item></Col>
            ))}
            {!expanded && Array.from({ length: 6 - showing.length }).map((_, i) => <Col span={8} key={`p-${i}`} />)}
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
          <Typography.Title level={5} style={{ margin: 0 }}>企业列表</Typography.Title>
          <Space><Button>导出</Button><Button>导入</Button><Button type="primary" onClick={() => navigate("/enterprises/new")}>新增</Button></Space>
        </div>
        <Table rowKey="id" scroll={{ x: 2100 }} dataSource={enterprises} pagination={{ pageSize: 8 }} columns={[
          { title: '企业名称', dataIndex: 'name', width: 340, render: (v) => <Tooltip title={v}><Typography.Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>{v}</Typography.Paragraph></Tooltip> },
          { title: '企业编号', dataIndex: 'cid', width: 180 },
          { title: '地区', dataIndex: 'region', width: 120 },
          { title: '企业启用状态', dataIndex: 'enableStatus', width: 140, render: (v) => <EnableTag status={v} /> },
          { title: '企业审核状态', dataIndex: 'reviewStatus', width: 140, render: (v) => <ReviewTag status={v} /> },
          { title: '服务通道', dataIndex: 'channels', width: 200, render: (v: string[]) => v.join(', ') },
          { title: '公司模式', dataIndex: 'companyMode', width: 120 },
          { title: '法律地位', dataIndex: 'legalStatus', width: 160 },
          { title: '公司电话', dataIndex: 'phone', width: 160 },
          { title: '电邮地址', dataIndex: 'email', width: 200 },
          { title: '成立时间', dataIndex: 'foundedAt', width: 120 },
          { title: '创建时间', dataIndex: 'createdAt', width: 180 },
          { title: '上單來源', dataIndex: 'source', width: 160, render: (v: string[]) => v.join(', ') },
          { title: '创建人', dataIndex: 'creator', width: 140 },
          { title: '更新时间', dataIndex: 'updatedAt', width: 180 },
          {
            title: '操作', key: 'action', width: 160, fixed: 'right', render: (_, r) => (
              <Space direction="vertical" align="start">
                <Button type="link" onClick={() => navigate(`/enterprises/${r.id}`)}>查看详情</Button>
                {r.reviewStatus === '审核通过' && <Button type="link" onClick={() => navigate(`/enterprises/${r.id}/edit`)}>编辑</Button>}
                {r.reviewStatus === '审核通过' && <Button type="link" onClick={() => Modal.confirm({ title: `是否${r.enableStatus === '启用' ? '停用' : '启用'}该企业`, onOk: () => updateEnableStatus(r.id, r.enableStatus === '启用' ? '停用' : '启用') })}>{r.enableStatus === '启用' ? '停用' : '启用'}</Button>}
                {r.reviewStatus === '审核不通过' && <Button type="link" onClick={() => resubmit(r.id)}>重新提交审核</Button>}
              </Space>
            )
          }
        ]} />
      </Card>
    </Space>
  );
};
