// src/pages/AdminLogs.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../components/css/Admin.css';

const AdminLogs = () => {
  const { t } = useTranslation();

  return (
    <div className="admin-logs-content">
      <h1 className="admin-dashboard-content h1">{t('logs')}</h1>
      <p>Bu sayfa, sistem log kayıtlarını gösterecektir.</p>
    </div>
  );
};

export default AdminLogs;