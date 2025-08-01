// src/pages/Admin.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../components/css/Admin.css';

// Settings bileşenini ve ilgili ikonları import edin
import Settings from './Settings'; // Settings bileşenini doğrudan import ediyoruz
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const Admin = () => {
    const { user, token, loading } = useAuth();
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    // Ayarlar panelinin açık/kapalı durumunu yönetmek için yeni state
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        // Check after loading is complete and user data is available
        if (!loading) {
            if (!token) {
                // Redirect to login page if the user is not logged in
                navigate('/login');
            } else if (user?.role?.toUpperCase() !== 'ADMIN') {
                // Redirect to not-authorized page if the user is not an admin
                navigate('/not-authorized');
            }
        }
    }, [token, user, loading, navigate]);

    // Yükleme veya yetkilendirme kontrolü sırasında yükleme mesajı göster
    if (loading || !user || user.role?.toUpperCase() !== 'ADMIN') {
        return <div>Yükleniyor...</div>;
    }

    // Ayarlar panelini açan fonksiyon
    const handleOpenSettings = () => {
        setIsSettingsOpen(true);
    };

    // Ayarlar panelini kapatan fonksiyon
    const handleCloseSettings = () => {
        setIsSettingsOpen(false);
    };

    // Yönetim panelini render et
    return (
        <div className="admin-container">
            {/* Yan menü (Sidebar) */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Yönetim Paneli</h2>
                </div>
                <nav className="sidebar-nav">
                    <Link 
                        to="/admin" 
                        onClick={() => setActiveMenu('dashboard')} 
                        className={`nav-link ${activeMenu === 'dashboard' ? 'active' : ''}`}
                    >
                        Kontrol Paneli
                    </Link>
                    <Link 
                        to="/admin/workspaces" 
                        onClick={() => setActiveMenu('workspaces')} 
                        className={`nav-link ${activeMenu === 'workspaces' ? 'active' : ''}`}
                    >
                        Workspaceler
                    </Link>
                    <Link 
                        to="/admin/boards" 
                        onClick={() => setActiveMenu('boards')} 
                        className={`nav-link ${activeMenu === 'boards' ? 'active' : ''}`}
                    >
                        Panolar
                    </Link>
                    <Link 
                        to="/admin/logs" 
                        onClick={() => setActiveMenu('logs')} 
                        className={`nav-link ${activeMenu === 'logs' ? 'active' : ''}`}
                    >
                        Log Kayıtları
                    </Link>
                </nav>
            </aside>
            
            {/* Ana içerik alanı - alt rotalar burada render edilecek */}
            <main className="admin-main">
                {/* Admin-main'in içine ayarlar butonunu ve başlığı ekleyelim */}
                <div className="admin-main-header">
                    {/* Ayarlar butonu */}
                    <IconButton onClick={handleOpenSettings} className="settings-button">
                        <SettingsIcon />
                    </IconButton>
                </div>
                {/* Outlet'i doğrudan main'in içine taşıyoruz */}
                <Outlet />
            </main>

            {/* Ayarlar paneli, sadece isSettingsOpen true olduğunda görüntülenir. */}
            {isSettingsOpen && <Settings open={isSettingsOpen} onClose={handleCloseSettings} />}
        </div>
    );
};

export default Admin;
