import { ConfigProvider, theme } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { EnterpriseDetailPage } from './pages/EnterpriseDetailPage';
import { EnterpriseEditPage } from './pages/EnterpriseEditPage';
import { EnterpriseListPage } from './pages/EnterpriseListPage';
import { MerchantReviewDetailPage } from './pages/MerchantReviewDetailPage';
import { MerchantReviewListPage } from './pages/MerchantReviewListPage';
import { MerchantReviewEditPage } from './pages/MerchantReviewEditPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ShopDetailPage } from './pages/ShopDetailPage';
import { ShopEditPage } from './pages/ShopEditPage';
import { ShopListPage } from './pages/ShopListPage';

export default function App() {
  const brandPrimary = '#1F2A37';
  const brandPrimaryHover = '#2b3a4c';
  const brandPrimaryActive = '#18222e';
  const brandSoft = '#F5F7FA';
  const brandAccent = '#D79A3A';

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: brandPrimary,
          colorInfo: brandPrimary,
          colorLink: brandPrimary,
          colorLinkHover: brandPrimaryHover,
          borderRadius: 6
        },
        components: {
          Menu: {
            itemSelectedBg: '#F6EFE3',
            itemSelectedColor: brandPrimary,
            subMenuItemSelectedColor: brandPrimary,
            itemActiveBg: '#FAF5EC'
          },
          Button: {
            colorPrimary: brandPrimary,
            colorPrimaryHover: brandPrimaryHover,
            colorPrimaryActive: brandPrimaryActive
          },
          Tag: {
            defaultBg: '#FAF7F1'
          },
          Segmented: {
            itemSelectedBg: brandSoft
          },
          Select: {
            optionSelectedBg: '#FAF5EC'
          },
          Badge: {
            colorPrimary: brandAccent
          }
        }
      }}
    >
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/enterprises" replace />} />
          <Route path="/enterprises" element={<EnterpriseListPage />} />
          <Route path="/shops" element={<ShopListPage />} />
          <Route path="/shops/:id" element={<ShopDetailPage />} />
          <Route path="/shops/:id/edit" element={<ShopEditPage />} />
          <Route path="/merchants" element={<MerchantReviewListPage />} />
          <Route path="/merchants/:id" element={<MerchantReviewDetailPage />} />
          <Route path="/merchants/:id/edit" element={<MerchantReviewEditPage />} />
          <Route path="/enterprises/:id" element={<EnterpriseDetailPage />} />
          <Route path="/enterprises/:id/edit" element={<EnterpriseEditPage />} />
          <Route path="*" element={<PlaceholderPage />} />
        </Routes>
      </AppLayout>
    </ConfigProvider>
  );
}
