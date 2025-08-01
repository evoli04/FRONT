import React from 'react';
import { FiSettings, FiLogOut, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import BoardList from './Board';
import '../components/css/WorkspaceSidebar.css';

export default function WorkspaceSidebar({
    workspaces,
    selectedWorkspace,
    onSelectWorkspace,
    onShowAllWorkspaces,
    onAddWorkspaceClick,
    onAddBoardClick
}) {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="header">
                <div className="logo">NODORA</div>
                <div className="header-actions">
                    <button className="header-button">
                        <FiSettings size={18} />
                    </button>
                    <button className="header-button" onClick={handleLogout}>
                        <FiLogOut size={18} />
                    </button>
                </div>
            </div>

            <div
                className="section-title"
                onClick={onShowAllWorkspaces}
                style={{ cursor: 'pointer' }}
            >
                Çalışma Alanlarım
            </div>

            <button className="add-button" onClick={onAddWorkspaceClick}>
                <FiPlus size={16} /> Çalışma Alanı Ekle
            </button>

            {workspaces.map(workspace => (
                <div key={workspace.id} className="workspace-section">
                    <div
                        className={`workspace-title ${selectedWorkspace?.id === workspace.id ? 'active' : ''}`}
                        onClick={() => onSelectWorkspace(workspace)}
                        style={{ cursor: 'pointer' }}
                    >
                        {workspace.name}
                    </div>

                    {selectedWorkspace?.id === workspace.id && (
                        <BoardList
                            boards={workspace.boards}
                            onAddBoardClick={onAddBoardClick}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}