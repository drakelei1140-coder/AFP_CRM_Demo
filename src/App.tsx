import { ConfigProvider, theme } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { EnterpriseDetailPage } from './pages/EnterpriseDetailPage';
import { EnterpriseEditPage } from './pages/EnterpriseEditPage';
import { EnterpriseListPage } from './pages/EnterpriseListPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: { colorPrimary: '#103E87', colorInfo: '#103E87', borderRadius: 6 },
        components: {
          Menu: {
            itemSelectedBg: '#E8F0FF',
            itemSelectedColor: '#103E87',
            subMenuItemSelectedColor: '#103E87'
          },
          Button: {
            colorPrimary: '#103E87',
            colorPrimaryHover: '#1a4d9e',
            colorPrimaryActive: '#0e326f'
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
