import { ConfigProvider, theme } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { EnterpriseDetailPage } from './pages/EnterpriseDetailPage';
import { EnterpriseEditPage } from './pages/EnterpriseEditPage';
import { EnterpriseListPage } from './pages/EnterpriseListPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

export default function App() {
  const brandPrimary = '#0F766E';
  const brandPrimaryHover = '#13887f';
  const brandPrimaryActive = '#0d5f59';
  const brandSoft = '#E6F4F2';
  const brandAccent = '#F4B400';

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
            itemSelectedBg: brandSoft,
            itemSelectedColor: brandPrimary,
            subMenuItemSelectedColor: brandPrimary,
            itemActiveBg: '#F3FBFA'
          },
          Button: {
            colorPrimary: brandPrimary,
            colorPrimaryHover: brandPrimaryHover,
            colorPrimaryActive: brandPrimaryActive
          },
          Tag: {
            defaultBg: '#F7FAFA'
          },
          Segmented: {
            itemSelectedBg: brandSoft
          },
          Select: {
            optionSelectedBg: brandSoft
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
          <Route path="/enterprises/:id" element={<EnterpriseDetailPage />} />
          <Route path="/enterprises/:id/edit" element={<EnterpriseEditPage />} />
          <Route path="*" element={<PlaceholderPage />} />
        </Routes>
      </AppLayout>
    </ConfigProvider>
  );
}
