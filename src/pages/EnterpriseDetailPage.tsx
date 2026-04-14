import { Button, Card, Col, Descriptions, Divider, Input, List, Modal, Row, Space, Table, Tag, Timeline, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EnableTag, ReviewTag } from '../components/StatusTag';
import { useEnterpriseStore } from '../store/enterpriseStore';

const sections = [
  ['overview', '企业概览'], ['keys', '企业主键与关联'], ['names', '企业名称信息'], ['operation', '企业主体与经营信息'], ['basic', '企业基础经营数据'],
  ['contact', '企业联系信息'], ['address', '企业地址信息'], ['file', '企业文件信息'], ['risk', '风控 / 业务信息'], ['blah', 'BL / AH 信息'],
  ['afp', 'AFP 对接信息'], ['devices', '拥有设备'], ['companies', '相关公司'], ['people', '相关人员'], ['timeline', '修改记录时间轴']
];

export const EnterpriseDetailPage = () => {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const store = useEnterpriseStore();
  const ent = store.getEnterprise(id);
  const [reason, setReason] = useState('');
  const [supplement, setSupplement] = useState('');
  const [afpOpen, setAfpOpen] = useState(false);

  if (!ent) return <Card>未找到企业</Card>;

  const opButtons = useMemo(() => {
    if (ent.reviewStatus === '待审核') return [<Button key="e" onClick={() => nav(`/enterprises/${ent.id}/edit`)}>编辑</Button>, <Button key="a" type="primary" onClick={() => Modal.confirm({ title: '审核通过（OPS）', content: <Input.TextArea rows={4} onChange={(e) => setReason(e.target.value)} />, onOk: () => store.approveByOps(ent.id, reason || '同意') })}>审核通过（OPS）</Button>, <Button key="r" danger onClick={() => Modal.confirm({ title: '审核驳回', content: <Input.TextArea rows={4} onChange={(e) => setReason(e.target.value)} />, onOk: () => store.reject(ent.id, reason || '不通过') })}>审核驳回</Button>, <Button key="n" onClick={() => Modal.confirm({ title: '通知补件（OPS）', content: <Input.TextArea rows={4} onChange={(e) => setSupplement(e.target.value)} />, onOk: () => store.notifySupplement(ent.id, supplement || '请补充资料', 'OPS') })}>通知补件（OPS）</Button>];
    if (ent.reviewStatus === '待风控审核') return [<Button key="e" onClick={() => nav(`/enterprises/${ent.id}/edit`)}>编辑</Button>, <Button key="a" type="primary" onClick={() => Modal.confirm({ title: '审核通过（风控）', content: <Input.TextArea rows={4} onChange={(e) => setReason(e.target.value)} />, onOk: () => store.approveByRisk(ent.id, reason || '风控通过') })}>审核通过（风控）</Button>, <Button key="r" danger onClick={() => Modal.confirm({ title: '审核驳回', content: <Input.TextArea rows={4} onChange={(e) => setReason(e.target.value)} />, onOk: () => store.reject(ent.id, reason || '风控驳回') })}>审核驳回</Button>, <Button key="n" onClick={() => Modal.confirm({ title: '通知补件（风控）', content: <Input.TextArea rows={4} onChange={(e) => setSupplement(e.target.value)} />, onOk: () => store.notifySupplement(ent.id, supplement || '请补充资料', '风控') })}>通知补件（风控）</Button>];
    if (ent.reviewStatus === '审核通过') return [<Button key="e" onClick={() => nav(`/enterprises/${ent.id}/edit`)}>编辑</Button>, <Button key="t" onClick={() => Modal.confirm({ title: `是否${ent.enableStatus === '启用' ? '停用' : '启用'}该企业`, onOk: () => store.updateEnableStatus(ent.id, ent.enableStatus === '启用' ? '停用' : '启用') })}>{ent.enableStatus === '启用' ? '停用' : '启用'}</Button>];
    return [<Button key="re" type="primary" onClick={() => store.resubmit(ent.id)}>重新提交审核</Button>];
  }, [ent, nav, reason, store, supplement]);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Card id="overview">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space wrap>{sections.map(([k, t]) => <Tag key={k} color="blue" style={{ cursor: 'pointer' }} onClick={() => document.getElementById(k)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{t}</Tag>)}</Space>
          <Row gutter={16}><Col span={18}><Typography.Title level={3} style={{ margin: 0 }}>{ent.name}</Typography.Title><Space><Typography.Text>CID: {ent.cid}</Typography.Text><Typography.Text>LE ID: {ent.leId}</Typography.Text><EnableTag status={ent.enableStatus} /><ReviewTag status={ent.reviewStatus} /></Space></Col><Col span={6}><Card size="small"><Typography.Text>下属商铺: {ent.shops.length}</Typography.Text><br /><Typography.Text>MID 数量: {ent.mids.length}</Typography.Text></Card></Col></Row>
          <Space wrap>{opButtons}</Space>
        </Space>
      </Card>

      {Object.entries(ent.sections).map(([key, value]) => (
        <Card key={key} id={key} title={sections.find((s) => s[0] === key)?.[1]}>
          <Descriptions column={3} bordered size="small" items={Object.entries(value).map(([k, v]) => ({ key: k, label: k, children: v || '-' }))} />
        </Card>
      ))}

      <Card id="afp" title="AFP 对接信息" extra={<Button onClick={() => setAfpOpen(true)}>查看详情</Button>}>
        <Typography.Paragraph type="secondary">AFP 对接字段使用 AFP 接口字段名，仅展示关键概要信息。</Typography.Paragraph>
        <Descriptions column={3} bordered items={ent.afpSummary.map((i) => ({ key: i.key, label: i.key, children: i.value }))} />
      </Card>

      <Card id="devices" title="拥有设备"><Table rowKey="id" pagination={false} dataSource={ent.devices} columns={[{ title: '设备ID', dataIndex: 'id' }, { title: '型号', dataIndex: 'model' }, { title: '状态', dataIndex: 'status' }, { title: '绑定商铺', dataIndex: 'bindShop' }]} /></Card>
      <Card id="companies" title="相关公司"><List dataSource={ent.relatedCompanies} renderItem={(i) => <List.Item>{i.name} / {i.relation} / {i.id}</List.Item>} /></Card>
      <Card id="people" title="相关人员"><List dataSource={ent.relatedPeople} renderItem={(i) => <List.Item>{i.name} / {i.role} / {i.mobile}</List.Item>} /></Card>
      <Card id="timeline" title="修改记录时间轴"><Timeline items={ent.timeline.map((i) => ({ children: `${i.time} - ${i.operator} - ${i.action}${i.detail ? `（${i.detail}）` : ''}` }))} /></Card>

      <Modal open={afpOpen} onCancel={() => setAfpOpen(false)} onOk={() => setAfpOpen(false)} title="AFP 详细字段">
        <Descriptions column={1} bordered items={Object.entries(ent.afpDetails).map(([k, v]) => ({ key: k, label: k, children: v }))} />
      </Modal>
      <Divider />
    </Space>
  );
};
