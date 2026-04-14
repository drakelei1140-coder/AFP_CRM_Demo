import {
  ApartmentOutlined,
  BankOutlined,
  BuildOutlined,
  FileDoneOutlined,
  GlobalOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, Select, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const menuTree = [
  { key: 'merchant', icon: <ShopOutlined />, label: '商户管理', children: [
    { key: '/enterprises', label: '企业管理', icon: <BankOutlined /> },
    { key: '/shops', label: '商铺管理', icon: <ShopOutlined /> },
    { key: '/merchants', label: '商户审核', icon: <FileDoneOutlined /> },
    { key: '/signed', label: '已签约商户', icon: <FileDoneOutlined /> },
    { key: '/cancelled', label: '取消签约商户', icon: <FileDoneOutlined /> },
    { key: '/rejected', label: '拒绝签约商户', icon: <FileDoneOutlined /> },
    { key: 'pending-change', label: '资料修改待审核', icon: <TeamOutlined />, children: [
      { key: '/pending-enterprise', label: '企业资料修改待审核' },
      { key: '/pending-shop', label: '商铺资料修改待审核' },
      { key: '/pending-merchant', label: '商户资料修改待审核' }
    ]},
    { key: '/device-approval', label: '终端设备申请/回收单审批', icon: <BuildOutlined /> },
    { key: '/onboarding', label: '商户进件', icon: <ApartmentOutlined /> },
    { key: '/afp-mapping', label: 'AFP 字段映射配置', icon: <GlobalOutlined /> }
  ]},
  { key: 'contract', icon: <WalletOutlined />, label: '合约管理', children: [
    { key: '/contracts', label: '已生成的合约' },
    { key: '/contract-mapping', label: '合约字段映射配置' }
  ]},
  { key: 'other', icon: <SettingOutlined />, label: '其他模块', children: [
    { key: '/os', label: 'O/S补件', icon: <NotificationOutlined /> },
    { key: '/channel', label: '通道管理', icon: <GlobalOutlined /> }
  ]}
];

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [openKeys, setOpenKeys] = useState<string[]>(() => JSON.parse(localStorage.getItem('crm-menu-open') || '["merchant"]'));
  const location = useLocation();
  const navigate = useNavigate();

  const selected = useMemo(() => (location.pathname.startsWith('/enterprises') ? '/enterprises' : location.pathname), [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ height: 80, lineHeight: '80px', position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #f0f0f0', paddingInline: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <img src="/logo.jpg" alt="KPay logo" style={{ height: 36, width: 'auto' }} />
            <Typography.Title level={4} style={{ margin: 0, color: '#0F766E' }}>KPay CRM</Typography.Title>
          </Space>
          <Space>
            <Select defaultValue="HK" style={{ width: 100 }} options={[{ value: 'HK', label: 'Hong Kong' }, { value: 'SG', label: 'Singapore' }]} />
            <Select defaultValue="zh-CN" style={{ width: 110 }} options={[{ value: 'zh-CN', label: '中文' }, { value: 'en-US', label: 'English' }]} />
            <Button className="brand-icon-button" icon={<NotificationOutlined />} />
            <Button className="brand-icon-button" icon={<SettingOutlined />} />
            <Dropdown menu={{ items: [{ key: '1', label: '个人中心' }, { key: '2', label: '退出登录' }] }}>
              <Space><Avatar>U</Avatar><Typography.Text>Ops User</Typography.Text></Space>
            </Dropdown>
          </Space>
        </Space>
      </Header>
      <Layout>
        <Sider width={280} style={{ background: '#fff', borderRight: '1px solid #f0f0f0', position: 'sticky', top: 80, height: 'calc(100vh - 80px)', overflow: 'auto' }}>
          <MenuUnfoldOutlined style={{ margin: 16, color: '#999' }} />
          <Menu mode="inline" items={menuTree} selectedKeys={[selected]} openKeys={openKeys} onOpenChange={(keys) => { setOpenKeys(keys); localStorage.setItem('crm-menu-open', JSON.stringify(keys)); }} onClick={(e) => navigate(e.key)} />
        </Sider>
        <Content style={{ padding: 24, background: '#f6f8fb' }}>{children}</Content>
      </Layout>
    </Layout>
  );
};
