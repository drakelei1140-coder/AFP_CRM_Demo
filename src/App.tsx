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
        token: { colorPrimary: '#0052CC', borderRadius: 6 }
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
