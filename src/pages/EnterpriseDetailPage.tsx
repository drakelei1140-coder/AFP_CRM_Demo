import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Timeline,
  Typography
} from 'antd';
import type { DescriptionsProps, TableColumnsType } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CopyOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { EnableTag, ReviewTag } from '../components/StatusTag';
import { useEnterpriseStore } from '../store/enterpriseStore';
import type { RelatedShop } from '../store/types';

const sectionNav = [
  ['overview', '企业概览'],
  ['keys', '企业主键与关联'],
  ['names', '企业名称信息'],
  ['operation', '企业主体与经营信息'],
  ['basic', '企业基础经营数据'],
  ['contact', '企业联系信息'],
  ['address', '企业地址信息'],
  ['file', '企业文件信息'],
  ['risk', '风控 / 业务信息'],
  ['afp', 'AFP 补充信息'],
  ['shops', '下属商铺'],
  ['companies', '相关公司'],
  ['people', '相关人员'],
  ['timeline', '修改记录时间轴']
] as const;

const boolText = (value: string) => {
  if (['true', '是', 'yes', 'y', '1'].includes((value || '').toLowerCase())) return '是';
  if (['false', '否', 'no', 'n', '0'].includes((value || '').toLowerCase())) return '否';
  return value || '-';
};

export const EnterpriseDetailPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const store = useEnterpriseStore();
  const enterprise = store.getEnterprise(id);

  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const targets = sectionNav.map(([key]) => document.getElementById(key)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current?.target?.id) setActiveSection(current.target.id);
      },
      { root: null, rootMargin: '-180px 0px -62% 0px', threshold: [0.08, 0.2, 0.4, 0.7] }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [enterprise?.id]);

  if (!enterprise) return <Card>未找到企业</Card>;

  const allSource = {
    ...enterprise.overview,
    ...enterprise.sections.keys,
    ...enterprise.sections.names,
    ...enterprise.sections.operation,
    ...enterprise.sections.basic,
    ...enterprise.sections.contact,
    ...enterprise.sections.address,
    ...enterprise.sections.file,
    ...enterprise.sections.risk,
    ...enterprise.afpDetails,
    ...Object.fromEntries(enterprise.afpSummary.map((item) => [item.key, item.value]))
  } as Record<string, string | number | null | undefined>;

  const pick = (label: string, fallback: string = '-') => {
    const value = allSource[label];
    if (value === null || value === undefined || value === '') return fallback;
    return String(value);
  };

  const renderValue = (label: string, value: string, type?: 'bool' | 'file' | 'id' | 'multiline' | 'status') => {
    const safeValue = value || '-';

    if (type === 'status') {
      return safeValue === '-' ? '-' : <Tag style={{ background: '#f6efe3', color: '#5c3b12', borderColor: '#ecd7b2' }}>{safeValue}</Tag>;
    }

    if (type === 'file') {
      if (safeValue === '-') return '-';
      return (
        <Space size={8} wrap>
          <Typography.Text>{safeValue}</Typography.Text>
          <Button size="small" icon={<EyeOutlined />}>查看</Button>
        </Space>
      );
    }

    const isId = type === 'id' || label.includes('ID') || label === 'CID' || label.includes('编号') || label.includes('號碼');
    if (isId && safeValue !== '-') {
      return <Typography.Text copyable={{ text: safeValue, icon: <CopyOutlined /> }}>{safeValue}</Typography.Text>;
    }

    if (type === 'bool') return boolText(safeValue);
    if (type === 'multiline') return <Typography.Text style={{ whiteSpace: 'pre-wrap' }}>{safeValue}</Typography.Text>;

    return safeValue;
  };

  const descriptionItems = (
    fields: Array<{ label: string; value?: string; type?: 'bool' | 'file' | 'id' | 'multiline' | 'status' }>
  ): DescriptionsProps['items'] =>
    fields.map((field) => {
      const value = field.value ?? pick(field.label);
      return {
        key: field.label,
        label: field.label,
        children: renderValue(field.label, value, field.type)
      };
    });

  const actionButtons = useMemo(() => {
    const reject = () =>
      Modal.confirm({
        title: '审核驳回',
        content: '确认将企业审核状态更新为审核不通过？',
        onOk: () => store.reject(enterprise.id, '详情页操作：审核驳回')
      });

    if (enterprise.reviewStatus === '待审核') {
      return [
        <Button key="edit" onClick={() => navigate(`/enterprises/${enterprise.id}/edit`)}>编辑</Button>,
        <Button key="approve-ops" type="primary" onClick={() => store.approveByOps(enterprise.id, '详情页操作：OPS审核通过')}>审核通过（OPS）</Button>,
        <Button key="reject" danger onClick={reject}>审核驳回</Button>,
        <Button key="supplement-ops" onClick={() => store.notifySupplement(enterprise.id, '详情页操作：请补件', 'OPS')}>通知补件（OPS）</Button>
      ];
    }

    if (enterprise.reviewStatus === '待风控审核') {
      return [
        <Button key="edit" onClick={() => navigate(`/enterprises/${enterprise.id}/edit`)}>编辑</Button>,
        <Button key="approve-risk" type="primary" onClick={() => store.approveByRisk(enterprise.id, '详情页操作：风控审核通过')}>审核通过（风控）</Button>,
        <Button key="reject" danger onClick={reject}>审核驳回</Button>,
        <Button key="supplement-risk" onClick={() => store.notifySupplement(enterprise.id, '详情页操作：请补件', '风控')}>通知补件（风控）</Button>
      ];
    }

    if (enterprise.reviewStatus === '审核通过' && enterprise.enableStatus === '启用') {
      return [
        <Button key="edit" onClick={() => navigate(`/enterprises/${enterprise.id}/edit`)}>编辑</Button>,
        <Button key="disable" onClick={() => store.updateEnableStatus(enterprise.id, '停用')}>停用</Button>
      ];
    }

    if (enterprise.reviewStatus === '审核通过' && enterprise.enableStatus === '停用') {
      return [
        <Button key="edit" onClick={() => navigate(`/enterprises/${enterprise.id}/edit`)}>编辑</Button>,
        <Button key="enable" onClick={() => store.updateEnableStatus(enterprise.id, '启用')}>启用</Button>
      ];
    }

    return [
      <Button key="resubmit" type="primary" onClick={() => store.resubmit(enterprise.id)}>
        重新提交审核
      </Button>
    ];
  }, [enterprise.enableStatus, enterprise.id, enterprise.reviewStatus, navigate, store]);

  const relatedShopColumns: TableColumnsType<RelatedShop> = [
    { title: '商铺名称', dataIndex: 'name' },
    { title: '商铺编号', dataIndex: 'id', render: (value) => <Typography.Text copyable>{value}</Typography.Text> },
    { title: '地区', dataIndex: 'region' },
    { title: '启用状态', dataIndex: 'enableStatus', render: (status) => <EnableTag status={status} /> },
    { title: '审核状态', dataIndex: 'reviewStatus', render: (status) => <ReviewTag status={status} /> },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Button size="small" type="link" onClick={() => navigate(`/shops/${record.id}`)}>
          查看详情
        </Button>
      )
    }
  ];

  return (
    <div style={{ width: '100%' }}>
      <Card id="overview" title="页面顶部概览区" style={{ marginBottom: 16 }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16}>
              <Space direction="vertical" size={6}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                  {pick('企业主显示名称', enterprise.name)}
                </Typography.Title>
                <Space size={8} wrap>
                  <Typography.Text>
                    CID: {renderValue('CID', pick('CID', enterprise.cid), 'id')}
                  </Typography.Text>
                  <span>
                    企业启用状态：<EnableTag status={enterprise.enableStatus} />
                  </span>
                  <span>
                    企业审核状态：<ReviewTag status={enterprise.reviewStatus} />
                  </span>
                </Space>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Row gutter={12}>
                <Col span={12}>
                  <Card size="small">
                    <Typography.Text type="secondary">下属商铺数量</Typography.Text>
                    <Typography.Title level={4} style={{ margin: '6px 0 0' }}>
                      {pick('下属商铺数量', String(enterprise.shops.length))}
                    </Typography.Title>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small">
                    <Typography.Text type="secondary">MID 数量</Typography.Text>
                    <Typography.Title level={4} style={{ margin: '6px 0 0' }}>
                      {pick('MID 数量', String(enterprise.mids.length))}
                    </Typography.Title>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          <Descriptions
            bordered
            size="small"
            column={2}
            items={descriptionItems([
              { label: '進件通道(必須)', value: enterprise.channels.join(' / ') || '-' },
              { label: '上單來源', value: enterprise.source.join(' / ') || '-' },
              { label: '創建時間', value: enterprise.createdAt },
              { label: '更新時間', value: enterprise.updatedAt }
            ])}
          />

          <Space wrap>{actionButtons}</Space>
        </Space>
      </Card>

      <div style={{ marginBottom: 16 }}>
        <div className="detail-section-nav-wrap detail-section-nav-sticky-strong">
          <div className="detail-section-nav">
            {sectionNav.map(([key, title]) => (
              <button
                type="button"
                key={key}
                className={`detail-section-nav-item ${activeSection === key ? 'active' : ''}`}
                onClick={() => document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Card id="keys" title="企业主键与关联信息区" style={{ marginBottom: 16 }}>
        <Descriptions bordered size="small" column={3} items={descriptionItems([
          { label: 'CID', value: enterprise.cid, type: 'id' },
          { label: '默认主联系人人员ID', type: 'id' },
          { label: '上級公司ID', type: 'id' }
        ])} />
      </Card>

      <Card id="names" title="企业名称信息区" style={{ marginBottom: 16 }}>
        <Typography.Title level={5} style={{ marginTop: 0 }}>主显示名称</Typography.Title>
        <Typography.Text strong>{pick('企业主显示名称', enterprise.name)}</Typography.Text>
        <Divider />
        <Descriptions bordered size="small" column={2} items={descriptionItems([
          { label: '商戶中文名稱' },
          { label: '商戶中文簡稱' },
          { label: '商戶英文名稱' },
          { label: '商戶英文簡稱' },
          { label: '商戶其它名稱' },
          { label: '商戶所有名稱（中文）', type: 'multiline' },
          { label: '商戶所有名稱（英文）', type: 'multiline' },
          { label: '商業登記證名稱' },
          { label: '公司登記証名稱(非必須)' }
        ])} />
      </Card>

      <Card id="operation" title="企业主体与经营信息区" style={{ marginBottom: 16 }}>
        <Typography.Title level={5} style={{ marginTop: 0 }}>主体属性</Typography.Title>
        <Descriptions bordered size="small" column={3} items={descriptionItems([
          { label: '公司模式' },
          { label: '是否子公司', type: 'bool' },
          { label: '公司結構' },
          { label: '小微商戶', type: 'bool' },
          { label: 'SME 設定', type: 'bool' },
          { label: '公司層級' }
        ])} />

        <Divider />
        <Typography.Title level={5}>行业与经营分类</Typography.Title>
        <Descriptions bordered size="small" column={2} items={descriptionItems([
          { label: '行業分類 / 業務性質 / 產品服務', value: pick('行業分類 / 業務性質 / 產品服務', pick('行業分類/業務性質/產品服務')) },
          { label: 'MCC Code' },
          { label: '進階MCC Code' },
          { label: 'special MCC 附件', type: 'file' }
        ])} />

        <Divider />
        <Typography.Title level={5}>税务与法务属性</Typography.Title>
        <Descriptions bordered size="small" column={3} items={descriptionItems([
          { label: '成立日期' },
          { label: '法律地位' },
          { label: '僱員人數' },
          { label: '注冊資本' },
          { label: '周年申報表 / 法團成立表(非必須)', type: 'file' },
          { label: '企业成立 / 适用法国家' },
          { label: '企业治理法律所在国' },
          { label: '企业税务申报分类' },
          { label: '企业税务业务类型' }
        ])} />
      </Card>

      <Card id="basic" title="企业基础经营数据区" style={{ marginBottom: 16 }}>
        <Typography.Title level={5} style={{ marginTop: 0 }}>6.1 交易与经营指标</Typography.Title>
        <Descriptions bordered size="small" column={3} items={descriptionItems([
          { label: '每宗交易平均金額' },
          { label: '每宗交易最大交易額' },
          { label: '預計每年交易宗數' },
          { label: '過往拒付比例' },
          { label: '拒付平均處理日數' },
          { label: '過往退款比例' },
          { label: '退款平均處理日數' },
          { label: '平均每月營業額' },
          { label: '經營方式' },
          { label: '提前收款日數' },
          { label: '貨物 / 服務最短送達時間' },
          { label: '貨物 / 服務最長送達時間' },
          { label: '經營年限' }
        ])} />

        <Divider />
        <Typography.Title level={5}>6.2 合约与业务属性</Typography.Title>
        <Descriptions bordered size="small" column={3} items={descriptionItems([
          { label: '進件通道(必須)', value: enterprise.channels.join(' / ') || '-' },
          { label: 'T1特選商戶', type: 'bool' },
          { label: '是否對公', type: 'bool' },
          { label: '小費功能', type: 'bool' },
          { label: '合約期' },
          { label: '是否首次申請卡機商戶（包括KPay及其他卡機）', type: 'bool' },
          { label: '申請過的卡機品牌（多選）' },
          { label: '在上述卡機中，商戶預計使用KPay的業務占比' },
          { label: '是否NGO', type: 'bool' },
          { label: '重複簽約原因' },
          { label: '商戶營業狀態（企業口徑）' }
        ])} />

        <Divider />
        <Typography.Title level={5}>6.3 税务与注册信息</Typography.Title>
        <Descriptions bordered size="small" column={3} items={descriptionItems([
          { label: '企业税务国家' },
          { label: '企业税号' },
          { label: '企业税号类型' },
          { label: 'VAT号' },
          { label: '无VAT原因' },
          { label: '税务申报分类' },
          { label: '税务业务类型' },
          { label: '公司註冊証號碼(非必須)' },
          { label: '周年申報表有效期(非必須)' }
        ])} />

        <Divider />
        <Typography.Title level={5}>6.4 上市与补充说明</Typography.Title>
        <Descriptions bordered size="small" column={3} items={descriptionItems([
          { label: '上市市场标识', type: 'status' },
          { label: '股票代码' },
          { label: '股票简称' },
          { label: '企业营业名称 / DBA' },
          { label: '企业描述', value: pick('企业描述', pick('企業描述')), type: 'multiline' },
          { label: '官网 / App Store URL' },
          { label: '職稱 / 職位' },
          { label: '歸屬國編號' },
          { label: '歸屬省編號' },
          { label: '分行號' },
          { label: '開戶費合計' },
          { label: '类型（企业）' }
        ])} />

        <Divider />
        <Typography.Title level={5}>6.5 附件与文档型字段</Typography.Title>
        <Descriptions bordered size="small" column={2} items={descriptionItems([
          { label: '退貨政策截圖', type: 'file' },
          { label: 'NP其他文檔', type: 'file' },
          { label: '公司章程大綱包括章程細則（如適用）(非必須)', type: 'file' },
          { label: '退貨政策', type: 'multiline' },
          { label: '財務報表審計', type: 'file' }
        ])} />
      </Card>

      <Card id="contact" title="企业联系信息区" style={{ marginBottom: 16 }}>
        <Descriptions bordered size="small" column={3} items={descriptionItems([
          { label: '公司電話' },
          { label: '手提電話' },
          { label: '管理員電郵' },
          { label: '運營電郵' },
          { label: '接收營銷資訊', type: 'bool' },
          { label: '微信ID' },
          { label: '企业电话类型' }
        ])} />
      </Card>

      <Card id="address" title="企业地址信息区" style={{ marginBottom: 16 }}>
        <Typography.Title level={5} style={{ marginTop: 0 }}>8.1 注册办事处地址</Typography.Title>
        <Descriptions bordered size="small" column={2} items={descriptionItems([
          { label: '註冊辦事處地址' },
          { label: '註冊辦事處地址(英文)' }
        ])} />

        <Divider />
        <Typography.Title level={5}>8.2 注册地址</Typography.Title>
        <Descriptions bordered size="small" column={3} items={descriptionItems([
          { label: '注册地址（原始全文）' },
          { label: '注册地址-街道' },
          { label: '注册地址-补充地址' },
          { label: '注册地址-城市' },
          { label: '注册地址-州 / 省', value: pick('注册地址-州 / 省', pick('注册地址-州/省')) },
          { label: '注册地址-邮编' },
          { label: '注册地址-国家' }
        ])} />

        <Divider />
        <Typography.Title level={5}>8.3 主要营业地址</Typography.Title>
        <Descriptions bordered size="small" column={3} items={descriptionItems([
          { label: '主要营业地址（原始全文）' },
          { label: '主要营业地址-街道' },
          { label: '主要营业地址-补充地址' },
          { label: '主要营业地址-城市' },
          { label: '主要营业地址-州 / 省', value: pick('主要营业地址-州 / 省', pick('主要营业地址-州/省')) },
          { label: '主要营业地址-邮编' },
          { label: '主要营业地址-国家' }
        ])} />

        <Divider />
        <Typography.Title level={5}>8.4 其他地址 / 联系</Typography.Title>
        <Descriptions bordered size="small" column={2} items={descriptionItems([
          { label: '郵寄地址' },
          { label: '電郵地址' }
        ])} />
      </Card>

      <Card id="file" title="企业文件信息区" style={{ marginBottom: 16 }}>
        <Table
          rowKey="field"
          pagination={false}
          dataSource={[
            '商戶篩查報告',
            '企業架構文件',
            '財務報表文件',
            '商業登記證號碼',
            '證書有效期',
            '商業登記證副本照片',
            '請提供重複簽約證明附件',
            '商業登記冊內的資料的電子摘錄（獨資經營者 / 合夥人適用）',
            '公司註冊證明書(非必須)',
            '慈善機構資料',
            '教育資料',
            '社團 / 協會資料',
            '業主立案法團資料',
            '入貨單',
            '閉路電視錄影',
            '最高交易金額的客戶單據'
          ].map((field) => ({ field, value: pick(field) }))}
          columns={[
            { title: '字段名', dataIndex: 'field', width: '36%' },
            {
              title: '文件 / 内容',
              dataIndex: 'value',
              render: (value: string, record: { field: string }) => renderValue(record.field, value, 'file')
            }
          ]}
        />
      </Card>

      <Card id="risk" title="风控 / 业务信息区" style={{ marginBottom: 16 }}>
        <Typography.Title level={5} style={{ marginTop: 0 }}>风控信息</Typography.Title>
        <Descriptions bordered size="small" column={2} items={descriptionItems([
          { label: '風控類型' },
          { label: '風險等級' },
          { label: '風險評估報告', type: 'file' },
          { label: '是否高額商戶', type: 'bool' }
        ])} />
        <Divider />
        <Typography.Title level={5}>业务协作信息</Typography.Title>
        <Descriptions bordered size="small" column={3} items={descriptionItems([
          { label: '審核類型' },
          { label: '上單來源', value: enterprise.source.join(' / ') || '-' },
          { label: '服務類型' },
          { label: '合作夥伴推薦人' },
          { label: '合作夥伴編號', type: 'id' },
          { label: '交單備註', type: 'multiline' }
        ])} />
      </Card>

      <Card id="afp" title="AFP 补充信息区" style={{ marginBottom: 16 }}>
        <Typography.Title level={5} style={{ marginTop: 0 }}>11.1 LE / 主体补充信息</Typography.Title>
        <Descriptions bordered size="small" column={3} items={descriptionItems([
          { label: '企业LE ID', value: pick('企业LE ID', enterprise.leId), type: 'id' },
          { label: '企业LE类型' },
          { label: '企业LE参考号' }
        ])} />

        <Divider />
        <Typography.Title level={5}>11.2 BL / 业务线补充信息</Typography.Title>
        <Descriptions bordered size="small" column={2} items={descriptionItems([
          { label: '业务线ID', value: pick('业务线ID', pick('businessLineId')), type: 'id' },
          { label: '业务线类型' },
          { label: '销售渠道' },
          { label: '资金流 / 清算模式', value: pick('资金流 / 清算模式', pick('资金流/清算模式')) }
        ])} />

        <Divider />
        <Typography.Title level={5}>11.3 AH / 账户持有人补充信息</Typography.Title>
        <Descriptions bordered size="small" column={3} items={descriptionItems([
          { label: '账户持有人ID', value: pick('账户持有人ID', pick('accountHolderId')), type: 'id' },
          { label: '账户持有人关联LE ID', type: 'id' },
          { label: '账户持有人描述' },
          { label: '账户持有人参考号' },
          { label: '账户持有人状态' },
          { label: '账户持有人地址-街道' },
          { label: '账户持有人地址-门牌号' },
          { label: '账户持有人地址-城市' },
          { label: '账户持有人地址-州省' },
          { label: '账户持有人地址-邮编' },
          { label: '账户持有人地址-国家' },
          { label: '账户持有人邮箱' },
          { label: '账户持有人电话' },
          { label: '账户持有人电话类型' }
        ])} />
      </Card>

      <Card
        id="shops"
        title="下属商铺区"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/shops/new?enterpriseId=${enterprise.id}`)}>新增商铺</Button>}
        style={{ marginBottom: 16 }}
      >
        <Table rowKey="id" pagination={false} dataSource={enterprise.shops} columns={relatedShopColumns} />
      </Card>

      <Card id="companies" title="相关公司区" style={{ marginBottom: 16 }}>
        <Table
          rowKey="id"
          pagination={false}
          dataSource={enterprise.relatedCompanies}
          columns={[
            { title: '相关公司名称', dataIndex: 'name' },
            { title: '相关公司编号', dataIndex: 'id', render: (value) => <Typography.Text copyable>{value}</Typography.Text> }
          ]}
        />
      </Card>

      <Card id="people" title="相关人员区" style={{ marginBottom: 16 }}>
        <Table
          rowKey="id"
          pagination={false}
          dataSource={enterprise.relatedPeople}
          columns={[
            { title: '人员姓名', dataIndex: 'name' },
            { title: '角色', dataIndex: 'role' },
            { title: '联系方式', dataIndex: 'mobile', render: (value) => <Typography.Text copyable>{value || '-'}</Typography.Text> }
          ]}
        />
      </Card>

      <Card id="timeline" title="修改记录时间轴区" style={{ marginBottom: 16 }}>
        <Timeline
          items={enterprise.timeline.map((item) => ({
            children: (
              <Space direction="vertical" size={0}>
                <Typography.Text strong>{item.time || '-'}</Typography.Text>
                <Typography.Text type="secondary">操作人：{item.operator || '-'}</Typography.Text>
                <Typography.Text>动作类型：{item.action || '-'}</Typography.Text>
                <Typography.Text>内容摘要：{item.detail || '-'}</Typography.Text>
              </Space>
            )
          }))}
        />
      </Card>
    </div>
  );
};
