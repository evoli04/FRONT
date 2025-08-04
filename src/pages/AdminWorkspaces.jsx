// src/pages/AdminWorkspaces.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getAdminWorkspaces } from '../services/api';
import '../components/css/Admin.css';

const AdminWorkspaces = () => {
    const { t } = useTranslation();

    const { data: workspaces, isLoading, error } = useQuery({
        queryKey: ['adminWorkspaces'],
        queryFn: getAdminWorkspaces,
    });

    if (isLoading) {
        return <div className="loading-container">{t('loading')}</div>;
    }

    if (error) {
        console.error("Failed to fetch workspaces:", error);
        return <div className="error-container">{t('errorFetchingData')}</div>;
    }

    return (
        <div className="admin-workspaces-content">
            <h1 className="admin-dashboard-content h1">{t('workspaces')}</h1>
            <div className="dashboard-cards">
                {workspaces && workspaces.length > 0 ? (
                    workspaces.map((workspace) => (
                        <div key={workspace.workspaceId} className="dashboard-card">
                            <h2>{t('workspaceId')}</h2>
                            <p>{workspace.workspaceId}</p>
                            <h2>{t('workspaceName')}</h2>
                            <p>{workspace.workspaceName}</p>
                            <h2>{t('memberId')}</h2>
                            <p>{workspace.memberId}</p>
                            <h2>{t('roleId')}</h2>
                            <p>{workspace.roleId}</p>
                        </div>
                    ))
                ) : (
                    <p>{t('noWorkspacesFound')}</p>
                )}
            </div>
        </div>
    );
};

export default AdminWorkspaces;