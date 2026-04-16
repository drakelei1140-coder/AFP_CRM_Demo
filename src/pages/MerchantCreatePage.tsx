import { Button, Card, Col, Form, Input, Modal, Row, Space, Table, Tag, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectionModal, type SelectableItem } from '../components/SelectionModal';
import { ProductRateTable, buildRateRows, type ProductRateRow } from '../components/ProductRateTable';
import { merchantFieldGroups } from '../config/fieldSchemas';

interface MerchantDraft { id: string; owner: string; [key: string]: string | string[]; }
const OPERATOR = 'Ops User';
const DRAFT_KEY = 'merchant-drafts';
const enterpriseItems: SelectableItem[] = [{ id: 'CID-101', name: 'HK Food Group' }, { id: 'CID-104', name: 'Approved Active Co' }];
const shopItems: SelectableItem[] = [{ id: 'SID-10001', name: '尖沙咀旗舰店', cid: 'CID-101' }, { id: 'SID-10003', name: '中环金融中心店', cid: 'CID-104' }];

export const MerchantCreatePage = () => {
  const [form] = Form.useForm();
  const [rates, setRates] = useState<ProductRateRow[]>(buildRateRows());
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [draftOpen, setDraftOpen] = useState(false);
  const [draftIdKeyword, setDraftIdKeyword] = useState('');
  const [draftNameKeyword, setDraftNameKeyword] = useState('');
  const nav = useNavigate();

  const channels: string[] = Form.useWatch('通道列表', form) || [];
  const enterpriseId = form.getFieldValue('CID');
  const drafts = useMemo<MerchantDraft[]>(() => JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: MerchantDraft) => x.owner === OPERATOR), [draftOpen]);
  const filteredDrafts = drafts.filter((d) => String(d.MID || '').includes(draftIdKeyword) && String(d.CID || '').includes(draftNameKeyword));

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Card title="新增商户" />
      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{merchantFieldGroups.map((g) => <Tag key={g.key} color="default">{g.title}</Tag>)}</div></div>

      <Card title="企业新增 / 选择区"><Space><Button onClick={() => setEnterpriseOpen(true)}>选择企业</Button><Button onClick={() => window.open('/enterprises/new', '_blank')}>新增企业</Button></Space><div style={{ marginTop: 8 }}>已选企业：{form.getFieldValue('CID') || '-'} / {form.getFieldValue('企业名称') || '-'}</div></Card>
      <Card title="商铺新增 / 选择区"><Space><Button disabled={!enterpriseId} onClick={() => setShopOpen(true)}>选择商铺</Button><Button disabled={!enterpriseId} onClick={() => window.open('/shops/new', '_blank')}>新增商铺</Button></Space><div style={{ marginTop: 8 }}>已选商铺：{form.getFieldValue('SID') || '-'} / {form.getFieldValue('商铺名称') || '-'}</div></Card>

      <Form form={form} layout="vertical" initialValues={{ '通道列表': [] }}>
        {merchantFieldGroups.map((group) => (
          <Card key={group.key} title={group.title} style={{ marginTop: 16 }}>
            <Row gutter={16}>{group.fields.map((field) => <Col span={8} key={field}><Form.Item label={field} name={field}><Input /></Form.Item></Col>)}</Row>
          </Card>
        ))}
      </Form>

      {channels.length > 0 && <Card title="产品费率区"><ProductRateTable editable value={rates} onChange={setRates} /></Card>}

      <div className="sticky-bottom-actions"><Space><Button onClick={() => setDraftOpen(true)}>从草稿复制</Button><Button onClick={() => {
        const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]');
        const { CID: _, SID: __, 企业名称: ___, 商铺名称: ____, ...values } = form.getFieldsValue();
        all.unshift({ id: crypto.randomUUID(), owner: OPERATOR, ...values });
        localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
        message.success('已存成草稿');
      }}>存成草稿</Button><Button type="primary" onClick={async () => { await form.validateFields(); if (!channels.length) return message.warning('请先选择通道'); message.success('新增商户已保存，状态为待审核（demo模拟）'); nav('/merchants/m-2'); }}>保存</Button><Button onClick={() => nav(-1)}>取消</Button></Space></div>

      <SelectionModal open={enterpriseOpen} title="选择企业" items={enterpriseItems} onCancel={() => setEnterpriseOpen(false)} onSelect={(item) => { form.setFieldsValue({ CID: item.id, 企业名称: item.name }); setEnterpriseOpen(false); }} />
      <SelectionModal open={shopOpen} title="选择商铺" items={shopItems.filter((s) => s.cid === enterpriseId)} onCancel={() => setShopOpen(false)} onSelect={(item) => { form.setFieldsValue({ SID: item.id, 商铺名称: item.name }); setShopOpen(false); }} />

      <Modal open={draftOpen} onCancel={() => setDraftOpen(false)} footer={null} title="商户草稿箱" width={900}>
        <Space style={{ marginBottom: 12 }}><Input placeholder="按编号搜索" value={draftIdKeyword} onChange={(e) => setDraftIdKeyword(e.target.value)} /><Input placeholder="按名称搜索" value={draftNameKeyword} onChange={(e) => setDraftNameKeyword(e.target.value)} /></Space>
        <Table rowKey="id" dataSource={filteredDrafts} pagination={false} columns={[{ title: 'MID', dataIndex: 'MID' }, { title: 'CID', dataIndex: 'CID' }, { title: '操作', render: (_, r: MerchantDraft) => <Space><Button type="link" onClick={() => { form.setFieldsValue(r); setDraftOpen(false); }}>选择</Button><Button type="link" danger onClick={() => { const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: MerchantDraft) => x.id !== r.id); localStorage.setItem(DRAFT_KEY, JSON.stringify(all)); setDraftOpen(false); }}>删除</Button></Space> }]} />
      </Modal>
    </Space>
  );
};
