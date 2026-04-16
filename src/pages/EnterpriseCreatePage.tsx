import { Badge, Button, Card, Descriptions, Form, Input, Modal, Select, Space, Table, Typography, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cidFieldConfig } from './enterpriseCidFieldConfig';
import { useEnterpriseStore } from '../store/enterpriseStore';

const requiredFieldLabels = ['進件通道(必須)', '商戶中文名稱', '商戶英文名稱', '公司模式', '法律地位', '成立日期', '公司電話', '管理員電郵', '註冊辦事處地址(英文)', '上單來源'];

const navSections = [
  { key: 'overview', title: '页面顶部概览区' },
  { key: 'form', title: '企业资料填写区' }
] as const;

const groupOrder = ['主键/关联', '企业名称', '企业主体/经营', '企业基础', '企业联系', '企业地址', '注册地址', '主要营业地址', '企业文件', '风控/业务'];

export const EnterpriseCreatePage = () => {
  const nav = useNavigate();
  const store = useEnterpriseStore();
  const [form] = Form.useForm();
  const [activeSection, setActiveSection] = useState('overview');
  const [draftOpen, setDraftOpen] = useState(false);
  const [canSave, setCanSave] = useState(false);

  const groupedFields = useMemo(() => groupOrder
    .map((group) => ({
      group,
      fields: cidFieldConfig.filter((f) => f.group === group)
    }))
    .filter((block) => block.fields.length > 0), []);

  const toPayload = () => {
    const values = form.getFieldsValue(true) as Record<string, string | string[] | undefined>;
    const payload: Record<string, string> = {};
    cidFieldConfig.forEach((field) => {
      const value = values[field.key];
      if (Array.isArray(value)) payload[field.label] = value.join(', ');
      else payload[field.label] = value ? String(value) : '';
    });
    return payload;
  };

  const refreshSaveState = async () => {
    const requiredPassed = requiredFieldLabels.every((label) => {
      const f = cidFieldConfig.find((x) => x.label === label);
      if (!f) return true;
      const value = form.getFieldValue(f.key);
      return Array.isArray(value) ? value.length > 0 : !!value;
    });

    if (!requiredPassed) {
      setCanSave(false);
      return;
    }

    try {
      await form.validateFields({ validateOnly: true });
      setCanSave(true);
    } catch {
      setCanSave(false);
    }
  };

  const renderField = (key: string, label: string, readonly: boolean) => {
    const lower = label.toLowerCase();
    const rules = [] as Array<Record<string, unknown>>;
    if (requiredFieldLabels.includes(label)) {
      rules.push({ required: true, message: `${label}为必填项` });
    }
    if (label.includes('電郵') || lower.includes('email')) rules.push({ type: 'email', message: '邮箱格式不正确' });
    if (label.includes('電話') || label.includes('手提')) rules.push({ pattern: /^[+\d\s-]{6,30}$/, message: '电话格式不正确' });
    if (label.includes('日期') || label.includes('時間')) rules.push({ pattern: /^$|^\d{4}-\d{2}-\d{2}$/, message: '日期格式为 YYYY-MM-DD' });

    const inputNode = label.includes('附件') || label.includes('文件') || label.includes('報告') || label.includes('照片')
      ? <Upload beforeUpload={() => false}><Button icon={<UploadOutlined />}>上传</Button></Upload>
      : label.includes('是否') || label.includes('狀態')
        ? <Select options={[{ value: '是' }, { value: '否' }]} />
        : label.includes('通道')
          ? <Select mode="multiple" options={[{ value: 'Adyen-AFP' }, { value: 'Adyen-payfac' }, { value: 'Other' }]} />
          : label.includes('來源')
            ? <Select mode="multiple" options={[{ value: 'CRM' }, { value: 'DMO' }, { value: 'SaaS' }, { value: 'Other' }]} />
            : label.includes('備註') || label.includes('描述') || label.includes('政策')
              ? <Input.TextArea rows={3} />
              : <Input placeholder={readonly ? '系统返回/生成字段' : ''} />;

    return (
      <Form.Item key={key} name={key} label={label} rules={rules}>
        {readonly ? <Input disabled placeholder="系统字段，仅展示占位" /> : inputNode}
      </Form.Item>
    );
  };

  const onSaveDraft = () => {
    store.saveCreateDraft(toPayload());
    message.success('已存成企业资料草稿（仅保存当前表单，不进入审核流程）');
    setDraftOpen(false);
  };

  const onSave = async () => {
    await form.validateFields();
    const created = store.createEnterprise(toPayload());
    message.success('企业创建成功，状态已进入待审核');
    nav(`/enterprises/${created.id}`);
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%', paddingBottom: 88 }}>
      <Card id="overview">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>新增企业</Typography.Title>
          <Typography.Text type="secondary">创建企业主体数据，保存后进入待审核。</Typography.Text>
          <Descriptions bordered size="small" column={3} items={[
            { key: 'status', label: '保存后审核状态', children: <Badge status="processing" text="待审核" /> },
            { key: 'draft', label: '草稿箱', children: '企业资料草稿箱（仅当前操作员可见）' },
            { key: 'flow', label: '提交流程', children: '保存后创建正式企业并跳转详情页' }
          ]} />
        </Space>
      </Card>

      <div className="detail-section-nav-wrap">
        <div className="detail-section-nav">
          {navSections.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`detail-section-nav-item ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(item.key);
                document.getElementById(item.key)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <Form form={form} layout="vertical" onValuesChange={refreshSaveState}>
        <Card id="form" title="企业资料填写区">
          {groupedFields.map((block) => (
            <Card key={block.group} type="inner" title={block.group} style={{ marginBottom: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                {block.fields.map((field) => renderField(field.key, field.label, field.readonly))}
              </div>
            </Card>
          ))}
        </Card>

      </Form>

      <div style={{ position: 'sticky', bottom: 12, zIndex: 20 }}>
        <Card>
          <Space>
            <Button onClick={() => setDraftOpen(true)}>从草稿复制</Button>
            <Button onClick={onSaveDraft}>存成草稿</Button>
            <Button type="primary" disabled={!canSave} onClick={onSave}>保存</Button>
            <Button onClick={() => nav('/enterprises')}>取消</Button>
          </Space>
        </Card>
      </div>

      <Modal open={draftOpen} onCancel={() => setDraftOpen(false)} footer={null} title="企业资料草稿箱" width={960}>
        <Table
          rowKey="id"
          dataSource={store.drafts}
          pagination={{ pageSize: 5 }}
          columns={[
            { title: '企业名称', dataIndex: 'name' },
            { title: '企业编号', dataIndex: 'cidPreview' },
            { title: '创建人', dataIndex: 'operator' },
            { title: '创建时间', dataIndex: 'createdAt' },
            { title: '更新时间', dataIndex: 'updatedAt' },
            {
              title: '操作',
              render: (_, record) => (
                <Space>
                  <Button type="link" onClick={() => { form.setFieldsValue(Object.fromEntries(cidFieldConfig.map((f) => [f.key, record.payload[f.label] || '']))); refreshSaveState(); setDraftOpen(false); }}>选择</Button>
                  <Button type="link" danger onClick={() => store.deleteDraft(record.id)}>删除</Button>
                </Space>
              )
            }
          ]}
        />
      </Modal>
    </Space>
  );
};
