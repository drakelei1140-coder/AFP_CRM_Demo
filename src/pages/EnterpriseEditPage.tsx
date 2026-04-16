import { Alert, Button, Card, Col, Descriptions, Form, Input, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEnterpriseStore } from '../store/enterpriseStore';

const navItems = [
  '企业主键与关联',
  '企业名称信息',
  '企业主体与经营信息',
  '企业基础经营数据',
  '企业联系信息',
  '企业地址信息',
  '企业文件信息',
  '风控 / 业务信息',
  '相关人员'
];

export const EnterpriseEditPage = () => {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const store = useEnterpriseStore();
  const ent = store.getEnterprise(id);
  const [form] = Form.useForm();

  const initial = useMemo(() => ({
    ...ent?.sections.keys,
    ...ent?.sections.names,
    ...ent?.sections.operation,
    ...ent?.sections.basic,
    ...ent?.sections.contact,
    ...ent?.sections.address,
    ...ent?.sections.file,
    ...ent?.sections.risk,
    relatedPeople: (ent?.relatedPeople || []).map((p) => ({ name: p.name, role: p.role, mobile: p.mobile }))
  }), [ent]);

  if (!ent) return <Card>未找到企业</Card>;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Typography.Title level={3} style={{ margin: 0 }}>企业编辑</Typography.Title>
      <Card title="基础信息区（系统识别字段，只读）">
        <Descriptions column={3} bordered items={[
          { key: 'name', label: '企业名称', children: ent.name },
          { key: 'cid', label: '企业编号', children: ent.cid },
          { key: 'region', label: '地区', children: ent.region },
          { key: 'enable', label: '企业启用状态', children: ent.enableStatus || '-' },
          { key: 'review', label: '企业审核状态', children: ent.reviewStatus },
          { key: 'channel', label: '服务通道', children: ent.channels.join(', ') },
          { key: 'source', label: '上單來源', children: ent.source.join(', ') },
          { key: 'creator', label: '创建人', children: ent.creator },
          { key: 'updatedAt', label: '更新时间', children: ent.updatedAt }
        ]} />
      </Card>

      <div className="detail-section-nav-wrap" style={{ position: 'sticky', top: 88, zIndex: 20 }}>
        <div className="detail-section-nav">{navItems.map((n) => <Tag key={n} color="default">{n}</Tag>)}</div>
      </div>

      <Form layout="vertical" form={form} initialValues={initial} onFinish={(values) => { store.submitEditDraft(ent.id, values); message.success('已提交企业资料修改待审核记录（demo模拟）'); nav(`/enterprises/${ent.id}`); }}>
        <Card title="企业主键与关联信息区">
          <Row gutter={16}>
            <Col span={8}><Form.Item name="默认主联系人人员ID" label="默认主联系人人员ID"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="上級公司ID" label="上級公司ID"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="企业名称信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="商戶中文名稱" label="商戶中文名稱" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="商戶中文簡稱" label="商戶中文簡稱" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="商戶英文名稱" label="商戶英文名稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="商戶英文簡稱" label="商戶英文簡稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="商戶其它名稱" label="商戶其它名稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="商戶所有名稱（中文）" label="商戶所有名稱（中文）"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="商戶所有名稱（英文）" label="商戶所有名稱（英文）"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="切換商戶顯示名稱（中文）" label="切換商戶顯示名稱（中文）"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="切換商戶顯示名稱（英文）" label="切換商戶顯示名稱（英文）"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="商業登記證名稱" label="商業登記證名稱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="公司登記証名稱(非必須)" label="公司登記証名稱(非必須)"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="企业主体与经营信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="公司模式" label="公司模式" rules={[{ required: true }]}><Select options={[{ value: '直营' }, { value: '加盟' }, { value: '连锁' }, { value: '其他' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="是否子公司" label="是否子公司"><Select options={[{ value: '是' }, { value: '否' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="公司結構" label="公司結構"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="行業分類/業務性質/產品服務" label="行業分類/業務性質/產品服務"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="MCC Code" label="MCC Code"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="進階MCC Code" label="進階MCC Code"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="special MCC 附件" label="special MCC 附件"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="小微商戶" label="小微商戶"><Select options={[{ value: '是' }, { value: '否' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="SME 設定" label="SME 設定"><Select options={[{ value: '是' }, { value: '否' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="成立日期" label="成立日期"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="法律地位" label="法律地位"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="僱員人數" label="僱員人數"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="注冊資本" label="注冊資本"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="企业基础经营数据区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="進件通道(必須)" label="進件通道(必須)"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="每宗交易平均金額" label="每宗交易平均金額"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="每宗交易最大交易額" label="每宗交易最大交易額"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="預計每年交易宗數" label="預計每年交易宗數"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="過往拒付比例" label="過往拒付比例"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="過往退款比例" label="過往退款比例"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="平均每月營業額" label="平均每月營業額"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="經營方式" label="經營方式"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="企業描述" label="企業描述"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="VAT号" label="VAT号"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="无VAT原因" label="无VAT原因"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="税务申报分类" label="税务申报分类"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="税务业务类型" label="税务业务类型"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="企业联系信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="公司電話" label="公司電話" rules={[{ pattern: /^[+\d\s-]{6,30}$/ }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="手提電話" label="手提電話" rules={[{ pattern: /^[+\d\s-]{6,30}$/ }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="管理員電郵" label="管理員電郵" rules={[{ type: 'email' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="運營電郵" label="運營電郵" rules={[{ type: 'email' }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="接收營銷資訊" label="接收營銷資訊"><Select options={[{ value: '是' }, { value: '否' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="微信ID" label="微信ID"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="企业地址信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="註冊辦事處地址" label="註冊辦事處地址"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="註冊辦事處地址(英文)" label="註冊辦事處地址(英文)"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="注册地址（原始全文）" label="注册地址（原始全文）"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="注册地址-街道" label="注册地址-街道"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="注册地址-补充地址" label="注册地址-补充地址"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="注册地址-城市" label="注册地址-城市"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="注册地址-州/省" label="注册地址-州/省"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="注册地址-邮编" label="注册地址-邮编"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="注册地址-国家" label="注册地址-国家"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="主要营业地址（原始全文）" label="主要营业地址（原始全文）"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="主要营业地址-街道" label="主要营业地址-街道"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="主要营业地址-补充地址" label="主要营业地址-补充地址"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="主要营业地址-城市" label="主要营业地址-城市"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="主要营业地址-州/省" label="主要营业地址-州/省"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="主要营业地址-邮编" label="主要营业地址-邮编"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="主要营业地址-国家" label="主要营业地址-国家"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="企业文件信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="商戶篩查報告" label="商戶篩查報告"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="企業架構文件" label="企業架構文件"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="財務報表文件" label="財務報表文件"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="商業登記證號碼" label="商業登記證號碼"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="證書有效期" label="證書有效期"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="风控 / 业务信息区" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="風控類型" label="風控類型"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="風險等級" label="風險等級"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="審核類型" label="審核類型"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="上單來源" label="上單來源"><Select mode="multiple" options={[{ value: 'CRM' }, { value: 'DMO' }, { value: 'SaaS' }, { value: '其他' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="服務類型" label="服務類型"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="合作夥伴推薦人" label="合作夥伴推薦人"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="合作夥伴編號" label="合作夥伴編號"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="相关人员编辑区" style={{ marginTop: 16 }}>
          <Form.List name="relatedPeople">
            {(fields, { add, remove }) => (
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                {fields.map((field) => (
                  <Card key={field.key} size="small">
                    <Row gutter={12}>
                      <Col span={7}><Form.Item {...field} label="人员姓名" name={[field.name, 'name']} rules={[{ required: true }]}><Input /></Form.Item></Col>
                      <Col span={7}><Form.Item {...field} label="人员角色" name={[field.name, 'role']} rules={[{ required: true }]}><Input /></Form.Item></Col>
                      <Col span={7}><Form.Item {...field} label="联系方式" name={[field.name, 'mobile']} rules={[{ required: true }]}><Input /></Form.Item></Col>
                      <Col span={3} style={{ display: 'flex', alignItems: 'end' }}><Button danger onClick={() => remove(field.name)}>删除</Button></Col>
                    </Row>
                  </Card>
                ))}
                <Button onClick={() => add({ name: '', role: '', mobile: '' })}>新增人员</Button>
              </Space>
            )}
          </Form.List>
        </Card>

        <Card title="关联商铺信息展示区" style={{ marginTop: 16 }}>
          <Table rowKey="id" pagination={false} dataSource={ent.shops} columns={[{ title: '商铺名称', dataIndex: 'name' }, { title: '商铺编号', dataIndex: 'id' }, { title: '地区', dataIndex: 'region' }, { title: '启用状态', dataIndex: 'enableStatus' }, { title: '审核状态', dataIndex: 'reviewStatus' }, { title: '操作', render: () => <Button type="link">查看详情</Button> }]} />
        </Card>

        <Card title="关联 MID 信息展示区" style={{ marginTop: 16 }}>
          <Table rowKey="id" pagination={false} dataSource={ent.mids} columns={[{ title: 'MID 编号', dataIndex: 'id' }, { title: '所属商铺', dataIndex: 'shopName' }, { title: '服务通道', dataIndex: 'channel' }, { title: '当前状态', dataIndex: 'status' }, { title: '更新时间', dataIndex: 'updatedAt' }, { title: '操作', render: () => <Button type="link">查看详情</Button> }]} />
        </Card>

        <div className="sticky-bottom-actions" style={{ position: 'sticky', bottom: 0, zIndex: 30, marginTop: 16 }}>
          <Space>
            <Button htmlType="submit" type="primary">保存并提交审核</Button>
            <Button onClick={() => nav(-1)}>取消</Button>
          </Space>
        </div>
      </Form>

      <Alert message="本页提交后仅生成资料修改待审核记录（demo模拟），不会直接覆盖正式数据。" type="info" showIcon />
    </Space>
  );
};
