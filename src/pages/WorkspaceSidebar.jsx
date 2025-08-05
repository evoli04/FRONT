import React from 'react';
import { FiSettings, FiLogOut, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../components/css/WorkspaceSidebar.css';

/**
 * Bu bileşen, çalışma alanları ve panolar için yan menüyü oluşturur.
 * 'isDarkTheme' prop'una göre temasını otomatik olarak ayarlar.
 * @param {Object[]} workspaces - Çalışma alanı listesi.
 * @param {Object} selectedWorkspace - Seçili olan çalışma alanı.
 * @param {Function} onSelectWorkspace - Çalışma alanı seçme işlevi.
 * @param {Function} onShowAllWorkspaces - Tüm çalışma alanlarını gösterme işlevi.
 * @param {Function} onAddWorkspaceClick - Yeni çalışma alanı ekleme işlevi.
 * @param {Function} onAddBoardClick - Yeni pano ekleme işlevi.
 * @param {Function} onDeleteWorkspace - Çalışma alanı silme işlevi.
 * @param {Function} onOpenSettings - Ayarlar panelini açma işlevi.
 * @param {boolean} isDarkTheme - Koyu tema aktifse 'true', değilse 'false'.
 */
export default function WorkspaceSidebar({
    workspaces,
    selectedWorkspace,
    onSelectWorkspace,
    onShowAllWorkspaces,
    onAddWorkspaceClick,
    onAddBoardClick,
    onDeleteWorkspace,
    onOpenSettings,
    isDarkTheme // Tema durumunu belirleyen yeni prop
}) {
    const navigate = useNavigate();

    const handleLogout = () => navigate('/login');

    const handleWorkspaceClick = (workspace) => {
        onSelectWorkspace(selectedWorkspace?.id === workspace.id ? null : workspace);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        onDeleteWorkspace(id);
    };

    // 'isDarkTheme' prop'una göre CSS sınıfını dinamik olarak belirliyoruz.
    // Koyu tema için 'sidebar dark' sınıfını, açık tema için sadece 'sidebar' sınıfını atıyoruz.
    const sidebarClass = isDarkTheme ? 'sidebar dark' : 'sidebar';

    return (
        <div className={sidebarClass}>
            <div className="header">
                <div className="logo-container">
                    <img src="/images/logo.png" alt="Uygulama Logosu" className="app-logo" />
                </div>

                <div className="header-actions">
                    <button className="header-button" onClick={onOpenSettings}>
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
