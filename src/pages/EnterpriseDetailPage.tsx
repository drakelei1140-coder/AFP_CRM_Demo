import { Button, Card, Descriptions, Space, Table, Timeline, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { enterpriseFieldGroups } from '../config/fieldSchemas';
import { useEnterpriseStore } from '../store/enterpriseStore';

export const EnterpriseDetailPage = () => {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const store = useEnterpriseStore();
  const ent = store.getEnterprise(id);

  if (!ent) return <Card>未找到企业</Card>;

  const valueMap: Record<string, string> = {
    CID: ent.cid,
    ...ent.sections.keys,
    ...ent.sections.names,
    ...ent.sections.operation,
    ...ent.sections.basic,
    ...ent.sections.contact,
    ...ent.sections.address,
    ...ent.sections.file,
    ...ent.sections.risk
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card><Typography.Title level={3} style={{ margin: 0 }}>{ent.name}</Typography.Title><Space><Typography.Text>CID: {ent.cid}</Typography.Text><Typography.Text>审核状态: {ent.reviewStatus}</Typography.Text><Button onClick={() => nav(`/enterprises/${ent.id}/edit`)}>编辑</Button></Space></Card>
      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{enterpriseFieldGroups.map((g) => <button type="button" key={g.key} className="detail-section-nav-item" onClick={() => document.getElementById(g.key)?.scrollIntoView({ behavior: 'smooth' })}>{g.title}</button>)}</div></div>

      {enterpriseFieldGroups.map((group) => (
        <Card key={group.key} id={group.key} title={group.title}>
          <Descriptions column={3} bordered items={group.fields.map((field) => ({ key: field, label: field, children: valueMap[field] || '-' }))} />
        </Card>
      ))}

      <Card title="下属商铺" extra={<Button type="primary" onClick={() => nav(`/shops/new?enterpriseId=${ent.id}`)}>新增商铺</Button>}><Table rowKey="id" pagination={false} dataSource={ent.shops} columns={[{ title: '商铺名称', dataIndex: 'name' }, { title: '商铺编号', dataIndex: 'id' }, { title: '审核状态', dataIndex: 'reviewStatus' }]} /></Card>
      <Card title="修改记录时间轴"><Timeline items={ent.timeline.map((i) => ({ children: `${i.time} - ${i.operator} - ${i.action}` }))} /></Card>
    </Space>
  );
};
