import { Button, Card, Col, Descriptions, Input, List, Modal, Row, Space, Table, Timeline, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EnableTag, ReviewTag } from '../components/StatusTag';
import { useEnterpriseStore } from '../store/enterpriseStore';

const sections = [
  ['overview', '企业概览'], ['keys', '企业主键与关联'], ['names', '企业名称信息'], ['operation', '企业主体与经营信息'], ['basic', '企业基础经营数据'],
  ['contact', '企业联系信息'], ['address', '企业地址信息'], ['file', '企业文件信息'], ['risk', '风控 / 业务信息'],
  ['shops', '下属商铺'], ['companies', '相关公司'], ['people', '相关人员'], ['timeline', '修改记录时间轴']
] as const;

export const EnterpriseDetailPage = () => {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const store = useEnterpriseStore();
  const ent = store.getEnterprise(id);
  const [reason, setReason] = useState('');
  const [supplement, setSupplement] = useState('');
  const [activeSection, setActiveSection] = useState<string>('overview');

  useEffect(() => {
    const targets = sections.map(([key]) => document.getElementById(key)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current?.target?.id) setActiveSection(current.target.id);
    }, { root: null, rootMargin: '-160px 0px -65% 0px', threshold: [0.05, 0.2, 0.5, 0.8] });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ent?.id]);

  if (!ent) return <Card>未找到企业</Card>;

  const opButtons = useMemo(() => {
    if (ent.reviewStatus === '待审核') return [<Button key="e" onClick={() => nav(`/enterprises/${ent.id}/edit`)}>编辑</Button>, <Button key="a" type="primary" onClick={() => Modal.confirm({ title: '审核通过（OPS）', content: <Input.TextArea rows={4} onChange={(e) => setReason(e.target.value)} />, onOk: () => store.approveByOps(ent.id, reason || '同意') })}>审核通过（OPS）</Button>, <Button key="r" danger onClick={() => Modal.confirm({ title: '审核驳回', content: <Input.TextArea rows={4} onChange={(e) => setReason(e.target.value)} />, onOk: () => store.reject(ent.id, reason || '不通过') })}>审核驳回</Button>, <Button key="n" onClick={() => Modal.confirm({ title: '通知补件（OPS）', content: <Input.TextArea rows={4} onChange={(e) => setSupplement(e.target.value)} />, onOk: () => store.notifySupplement(ent.id, supplement || '请补充资料', 'OPS') })}>通知补件（OPS）</Button>];
    if (ent.reviewStatus === '待风控审核') return [<Button key="e" onClick={() => nav(`/enterprises/${ent.id}/edit`)}>编辑</Button>, <Button key="a" type="primary" onClick={() => Modal.confirm({ title: '审核通过（风控）', content: <Input.TextArea rows={4} onChange={(e) => setReason(e.target.value)} />, onOk: () => store.approveByRisk(ent.id, reason || '风控通过') })}>审核通过（风控）</Button>, <Button key="r" danger onClick={() => Modal.confirm({ title: '审核驳回', content: <Input.TextArea rows={4} onChange={(e) => setReason(e.target.value)} />, onOk: () => store.reject(ent.id, reason || '风控驳回') })}>审核驳回</Button>, <Button key="n" onClick={() => Modal.confirm({ title: '通知补件（风控）', content: <Input.TextArea rows={4} onChange={(e) => setSupplement(e.target.value)} />, onOk: () => store.notifySupplement(ent.id, supplement || '请补充资料', '风控') })}>通知补件（风控）</Button>];
    if (ent.reviewStatus === '审核通过') return [<Button key="e" onClick={() => nav(`/enterprises/${ent.id}/edit`)}>编辑</Button>, <Button key="t" onClick={() => Modal.confirm({ title: `是否${ent.enableStatus === '启用' ? '停用' : '启用'}该企业`, onOk: () => store.updateEnableStatus(ent.id, ent.enableStatus === '启用' ? '停用' : '启用') })}>{ent.enableStatus === '启用' ? '停用' : '启用'}</Button>];
    return [<Button key="re" type="primary" onClick={() => store.resubmit(ent.id)}>重新提交审核</Button>];
  }, [ent, nav, reason, store, supplement]);

  return (
    <div style={{ width: '100%' }}>
      <Card id="overview">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}><Col span={18}><Typography.Title level={3} style={{ margin: 0 }}>{ent.name}</Typography.Title><Space><Typography.Text>CID: {ent.cid}</Typography.Text><EnableTag status={ent.enableStatus} /><ReviewTag status={ent.reviewStatus} /></Space></Col><Col span={6}><Card size="small"><Typography.Text>下属商铺: {ent.shops.length}</Typography.Text><br /><Typography.Text>MID 数量: {ent.mids.length}</Typography.Text></Card></Col></Row>
          <Space wrap>{opButtons}</Space>
        </Space>
      </Card>

      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{sections.map(([k, t]) => <button type="button" key={k} className={`detail-section-nav-item ${activeSection === k ? 'active' : ''}`} onClick={() => document.getElementById(k)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{t}</button>)}</div></div>

      {Object.entries(ent.sections).filter(([key]) => !['blah'].includes(key)).map(([key, value]) => (
        <Card key={key} id={key} title={sections.find((s) => s[0] === key)?.[1]} style={{ marginBottom: 16 }}>
          <Descriptions column={3} bordered size="small" items={Object.entries(value).filter(([label]) => !label.includes('LE')).map(([k, v]) => ({ key: k, label: k, children: v || '-' }))} />
        </Card>
      ))}

      <Card id="shops" title="下属商铺" extra={<Button type="primary" onClick={() => nav(`/shops/new?enterpriseId=${ent.id}`)}>新增商铺</Button>} style={{ marginBottom: 16 }}>
        <Table rowKey="id" pagination={false} dataSource={ent.shops} columns={[{ title: '商铺名称', dataIndex: 'name' }, { title: '商铺编号', dataIndex: 'id' }, { title: '地区', dataIndex: 'region' }, { title: '启用状态', dataIndex: 'enableStatus' }, { title: '审核状态', dataIndex: 'reviewStatus' }]} />
      </Card>
      <Card id="companies" title="相关公司" style={{ marginBottom: 16 }}><List dataSource={ent.relatedCompanies} renderItem={(i) => <List.Item>{i.name} / {i.relation} / {i.id}</List.Item>} /></Card>
      <Card id="people" title="相关人员" style={{ marginBottom: 16 }}><List dataSource={ent.relatedPeople} renderItem={(i) => <List.Item>{i.name} / {i.role} / {i.mobile}</List.Item>} /></Card>
      <Card id="timeline" title="修改记录时间轴" style={{ marginBottom: 16 }}><Timeline items={ent.timeline.map((i) => ({ children: `${i.time} - ${i.operator} - ${i.action}${i.detail ? `（${i.detail}）` : ''}` }))} /></Card>
    </div>
  );
};
