import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { EnterpriseStoreProvider } from './store/enterpriseStore';
import 'antd/dist/reset.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <EnterpriseStoreProvider>
        <App />
      </EnterpriseStoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);
