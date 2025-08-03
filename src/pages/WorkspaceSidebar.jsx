import React from 'react';
import { FiSettings, FiLogOut, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../components/css/WorkspaceSidebar.css';

export default function WorkspaceSidebar({
    workspaces,
    selectedWorkspace,
    onSelectWorkspace,
    onShowAllWorkspaces,
    onAddWorkspaceClick,
    onAddBoardClick,
    onDeleteWorkspace
}) {
    const navigate = useNavigate();

    const handleLogout = () => navigate('/login');
    const handleSettings = () => navigate('/Settings2'); // settings2 yerine settings yaptım

    const handleWorkspaceClick = (workspace) => {
        onSelectWorkspace(selectedWorkspace?.id === workspace.id ? null : workspace);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        onDeleteWorkspace(id);
    };

    return (
        <div className="sidebar">
            <div className="header">
                <div className="logo">NODORA</div>
                <div className="header-actions">
                    <button className="header-button" onClick={handleSettings}>
                        <FiSettings size={18} />
                    </button>
                    <button className="header-button" onClick={handleLogout}>
                        <FiLogOut size={18} />
                    </button>
                </div>
            </div>

            <div className="section-title" onClick={onShowAllWorkspaces}>
                Çalışma Alanlarım
            </div>

            <button className="add-button" onClick={onAddWorkspaceClick}>
                <FiPlus size={16} /> Çalışma Alanı Ekle
            </button>

            <div className="workspaces-list">
                {workspaces.map(workspace => (
                    <div key={workspace.id} className="workspace-item">
                        <div
                            className={`workspace-header ${selectedWorkspace?.id === workspace.id ? 'active' : ''}`}
                            onClick={() => handleWorkspaceClick(workspace)}
                        >
                            <span className="workspace-title">{workspace.name}</span>
                            <button
                                className="delete-btn"
                                onClick={(e) => handleDelete(e, workspace.id)}
                            >
                                <FiTrash2 size={14} />
                            </button>
                        </div>

                        {selectedWorkspace?.id === workspace.id && (
                            <div className="boards-container">
                                {workspace.boards.map((board, idx) => (
                                    <div
                                        key={idx}
                                        className="board-item"
                                        onClick={() => console.log('Board clicked:', board)}
                                    >
                                        {board}
                                    </div>
                                ))}
                                <button
                                    className="add-board-btn"
                                    onClick={onAddBoardClick}
                                >
                                    <FiPlus size={14} /> Pano Ekle
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}