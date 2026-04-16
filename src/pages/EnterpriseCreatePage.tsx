import { Button, Card, Col, Form, Input, Modal, Row, Space, Table, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enterpriseFieldGroups } from '../config/fieldSchemas';
import { useEnterpriseStore } from '../store/enterpriseStore';

interface EnterpriseDraft { id: string; owner: string; [key: string]: string; }
const DRAFT_KEY = 'enterprise-drafts';
const OPERATOR = 'Ops User';

export const EnterpriseCreatePage = () => {
  const [form] = Form.useForm();
  const [draftOpen, setDraftOpen] = useState(false);
  const [nameKeyword, setNameKeyword] = useState('');
  const [idKeyword, setIdKeyword] = useState('');
  const navigate = useNavigate();
  const { enterprises } = useEnterpriseStore();

  const drafts = useMemo<EnterpriseDraft[]>(() => JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: EnterpriseDraft) => x.owner === OPERATOR), [draftOpen]);
  const filteredDrafts = drafts.filter((d) => (d.CID || '').includes(idKeyword) && (d['商戶中文名稱'] || '').includes(nameKeyword));

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card><Typography.Title level={3} style={{ margin: 0 }}>新增企业</Typography.Title><Typography.Text type="secondary">用于创建新的企业主体资料，保存后进入待审核状态。</Typography.Text></Card>
      <div className="detail-section-nav-wrap"><div className="detail-section-nav">{enterpriseFieldGroups.map((g) => <Tag key={g.key} color="default">{g.title}</Tag>)}</div></div>

      <Form form={form} layout="vertical" initialValues={{ CID: '' }}>
        {enterpriseFieldGroups.map((group) => (
          <Card key={group.key} title={group.title} style={{ marginTop: 16 }}>
            <Row gutter={16}>
              {group.fields.map((field) => (
                <Col span={8} key={field}><Form.Item label={field} name={field}><Input disabled={field === 'CID'} placeholder={field === 'CID' ? '系统生成' : ''} /></Form.Item></Col>
              ))}
            </Row>
          </Card>
        ))}
      </Form>

      <div className="sticky-bottom-actions"><Space><Button onClick={() => setDraftOpen(true)}>从草稿复制</Button><Button onClick={() => {
        const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]');
        all.unshift({ id: crypto.randomUUID(), owner: OPERATOR, ...form.getFieldsValue() });
        localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
        message.success('已存成草稿');
      }}>存成草稿</Button><Button type="primary" onClick={async () => { await form.validateFields(); message.success('新增企业已保存，状态为待审核（demo模拟）'); navigate(`/enterprises/${enterprises[0].id}`); }}>保存</Button><Button onClick={() => navigate(-1)}>取消</Button></Space></div>

      <Modal open={draftOpen} onCancel={() => setDraftOpen(false)} footer={null} title="企业草稿箱" width={900}>
        <Space style={{ marginBottom: 12 }}><Input placeholder="按编号搜索" value={idKeyword} onChange={(e) => setIdKeyword(e.target.value)} /><Input placeholder="按名称搜索" value={nameKeyword} onChange={(e) => setNameKeyword(e.target.value)} /></Space>
        <Table rowKey="id" dataSource={filteredDrafts} columns={[{ title: '编号', dataIndex: 'CID' }, { title: '名称', dataIndex: '商戶中文名稱' }, { title: '操作', render: (_, r: EnterpriseDraft) => <Space><Button type="link" onClick={() => { form.setFieldsValue(r); setDraftOpen(false); }}>选择</Button><Button type="link" danger onClick={() => { const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]').filter((x: EnterpriseDraft) => x.id !== r.id); localStorage.setItem(DRAFT_KEY, JSON.stringify(all)); setDraftOpen(false); }}>删除</Button></Space> }]} pagination={false} />
      </Modal>
    </Space>
  );
};
