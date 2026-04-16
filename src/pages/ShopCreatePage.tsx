import { Button, Card, Col, Form, Input, Modal, Row, Space, Table, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SelectionModal, type SelectableItem } from '../components/SelectionModal';
import { shopFieldGroups } from '../config/fieldSchemas';
import { useEnterpriseStore } from '../store/enterpriseStore';

interface ShopDraft { id: string; owner: string; [key: string]: string; }
const OPERATOR = 'Ops User';
const DRAFT_KEY = 'shop-drafts';

export const ShopCreatePage = () => {
  const [form] = Form.useForm();
  const [search] = useSearchParams();
  const [draftOpen, setDraftOpen] = useState(false);
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  const [draftIdKeyword, setDraftIdKeyword] = useState('');
  const [draftNameKeyword, setDraftNameKeyword] = useState('');
  const nav = useNavigate();
  const { enterprises } = useEnterpriseStore();
  const lockedEnterpriseId = search.get('enterpriseId') || undefined;

  const enterpriseItems: SelectableItem[] = enterprises.map((e) => ({ id: e.cid, name: e.name, region: e.region }));
  const drafts = useMemo<ShopDraft[]>(() => JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: ShopDraft) => x.owner === OPERATOR), [draftOpen]);
  const filteredDrafts = drafts.filter((d) => (d.SID || '').includes(draftIdKeyword) && (d['商铺中文名称'] || '').includes(draftNameKeyword));

  const onSelectEnterprise = (item: SelectableItem) => {
    form.setFieldsValue({ '所属企业编号（CID）': item.id, 所属企业名称: item.name });
    setEnterpriseOpen(false);
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card><Typography.Title level={3} style={{ margin: 0 }}>新增商铺</Typography.Title><Typography.Text type="secondary">先选择企业，保存后进入待审核状态。</Typography.Text></Card>
      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{shopFieldGroups.map((g) => <Tag key={g.key} color="default">{g.title}</Tag>)}</div></div>

      <Card title="所属企业选择区" extra={<Space><Button onClick={() => setEnterpriseOpen(true)}>选择企业</Button><Button onClick={() => {
        const selected = enterprises.find((e) => e.cid === form.getFieldValue('所属企业编号（CID）'));
        if (!selected) return;
        form.setFieldsValue({ '商铺中文名称': selected.name, 商铺电话: selected.phone, 管理员电邮: selected.email, '门店地址（原始全文）': selected.sections.address['主要营业地址（原始全文）'] });
        message.success('已从企业复制信息');
      }}>从企业复制信息</Button></Space>}>
        <DescriptionsLike values={{ '所属企业编号（CID）': form.getFieldValue('所属企业编号（CID）') || lockedEnterpriseId || '-', 所属企业名称: form.getFieldValue('所属企业名称') || '-' }} />
      </Card>

      <Form form={form} layout="vertical" initialValues={{ '所属企业编号（CID）': lockedEnterpriseId }}>
        {shopFieldGroups.map((group) => (
          <Card key={group.key} title={group.title} style={{ marginTop: 16 }}>
            <Row gutter={16}>{group.fields.map((field) => <Col span={8} key={field}><Form.Item label={field} name={field}><Input disabled={field === '所属企业编号（CID）' && !!lockedEnterpriseId} /></Form.Item></Col>)}</Row>
          </Card>
        ))}
      </Form>

      <div className="sticky-bottom-actions"><Space><Button onClick={() => setDraftOpen(true)}>从草稿复制</Button><Button onClick={() => {
        const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]');
        const { '所属企业编号（CID）': _, 所属企业名称: __, ...draftData } = form.getFieldsValue();
        all.unshift({ id: crypto.randomUUID(), owner: OPERATOR, ...draftData });
        localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
        message.success('已存成草稿');
      }}>存成草稿</Button><Button type="primary" onClick={async () => { await form.validateFields(); message.success('新增商铺已保存，状态为待审核（demo模拟）'); nav('/shops/shop-1'); }}>保存</Button><Button onClick={() => nav(-1)}>取消</Button></Space></div>

      <SelectionModal open={enterpriseOpen} title="选择企业" items={enterpriseItems} onCancel={() => setEnterpriseOpen(false)} onSelect={onSelectEnterprise} extraColumns={[{ title: '地区', dataIndex: 'region' }]} />

      <Modal open={draftOpen} onCancel={() => setDraftOpen(false)} footer={null} title="商铺草稿箱" width={900}>
        <Space style={{ marginBottom: 12 }}><Input placeholder="按编号搜索" value={draftIdKeyword} onChange={(e) => setDraftIdKeyword(e.target.value)} /><Input placeholder="按名称搜索" value={draftNameKeyword} onChange={(e) => setDraftNameKeyword(e.target.value)} /></Space>
        <Table rowKey="id" dataSource={filteredDrafts} pagination={false} columns={[{ title: '编号', dataIndex: 'SID' }, { title: '名称', dataIndex: '商铺中文名称' }, { title: '操作', render: (_, r: ShopDraft) => <Space><Button type="link" onClick={() => { form.setFieldsValue(r); setDraftOpen(false); }}>选择</Button><Button type="link" danger onClick={() => { const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: ShopDraft) => x.id !== r.id); localStorage.setItem(DRAFT_KEY, JSON.stringify(all)); setDraftOpen(false); }}>删除</Button></Space> }]} />
      </Modal>
    </Space>
  );
};

const DescriptionsLike = ({ values }: { values: Record<string, string> }) => (
  <div>{Object.entries(values).map(([k, v]) => <div key={k}><strong>{k}：</strong>{v}</div>)}</div>
);
