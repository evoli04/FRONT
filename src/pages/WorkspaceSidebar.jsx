// src/pages/WorkspaceSidebar.jsx (veya src/components/WorkspaceSidebar.jsx)

import React from 'react';
import { FiSettings, FiLogOut, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import BoardList from './Board';
import '../components/css/WorkspaceSidebar.css';

export default function WorkspaceSidebar({
    workspaces,
    selectedWorkspace,
    onSelectWorkspace,
    onAddWorkspaceClick,
    onAddBoardClick
}) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Burada ayrıca logout işlemleri yapılabilir (token silme vb.)
        navigate('/login'); // Login sayfasına yönlendir
    };

    const handleOpenSettings = () => { // <-- Bu fonksiyonu eklediğinden emin ol
        navigate('/settings');
    };

    return (
        <div className="sidebar">
            <div className="header">
                <div className="logo">NODORA</div>
                <div className="header-actions">
                    <button 
                        className="header-button"
                        onClick={handleOpenSettings} // <-- Burası çok önemli
                    >
                        <FiSettings size={18} />
                    </button>
                    <button
                        className="header-button"
                        onClick={handleLogout}
                    >
                        <FiLogOut size={18} />
                    </button>
                </div>
            </div>

            {/* ... geri kalan kısım */}
        </div>
    );
}