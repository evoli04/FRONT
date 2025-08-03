import React from 'react';
import { useNavigate } from 'react-router-dom';

function Settings2() {
    const navigate = useNavigate();

    return (
        <div className="settings-container">
            <h1>Ayarlar Sayfası</h1>
            <button onClick={() => navigate(-1)}>Geri Dön</button>
            {/* Diğer ayar içerikleri buraya gelecek */}
        </div>
    );
}

export default Settings2;