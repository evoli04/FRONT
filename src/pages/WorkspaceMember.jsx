import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkspaceMembers } from '../services/api';
import { AuthContext } from '../context/AuthContext'; // Gerekirse kullanıcı rolü için AuthContext'i ekliyoruz
import '../components/css/workspace.css'; // Stil dosyasını dahil ettiğinizden emin olun

export default function WorkspaceMember() {
    // URL'den workspaceId parametresini alıyoruz
    const { workspaceId } = useParams();
    // API'den gelen üyeleri tutmak için state
    const [members, setMembers] = useState([]);
    // Yükleme durumu için state
    const [isLoading, setIsLoading] = useState(true);
    // Hata durumunu yönetmek için state
    const [error, setError] = useState(null);

    // useEffect hook'u ile bileşen yüklendiğinde veya workspaceId değiştiğinde API çağrısı yapıyoruz
    useEffect(() => {
        if (!workspaceId) {
            setError('Çalışma alanı ID bulunamadı.');
            setIsLoading(false);
            return;
        }

        const fetchMembers = async () => {
            setIsLoading(true);
            try {
                // Belirtilen API endpoint'ini kullanarak üyeleri çekiyoruz
                const fetchedMembers = await getWorkspaceMembers(workspaceId);

                // API'den gelen verinin bir dizi olup olmadığını kontrol et
                if (Array.isArray(fetchedMembers)) {
                    setMembers(fetchedMembers);
                    setError(null);
                } else {
                    console.warn("API'den gelen veri beklenenden farklı bir formatta (dizi değil):", fetchedMembers);
                    setMembers([]);
                    setError("API'den geçersiz üye verisi alındı.");
                }
            } catch (err) {
                console.error("Üyeler yüklenirken hata oluştu:", err);
                setError('Üyeler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMembers();
    }, [workspaceId]);

    // Yükleme durumunu ekranda gösteriyoruz
    if (isLoading) {
        return <div className="loading">Yükleniyor...</div>;
    }

    // Hata durumunu ekranda gösteriyoruz
    if (error) {
        return <div className="error">{error}</div>;
    }

    // Çalışma alanı üye listesini ekrana basıyoruz
    return (
        <div className="workspace-member-container">
            <h2 className="workspace-member-title">Çalışma Alanı Üyeleri</h2>
            <p className="workspace-id-info">Çalışma Alanı ID: {workspaceId}</p>
            {members.length > 0 ? (
                <ul className="member-list">
                    {members.map(member => (
                        <li key={member.memberId} className="member-item">
                            <span className="member-name">{member.memberEmail}</span>
                            <span className="member-role">{member.roleName}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Bu çalışma alanında henüz üye bulunmamaktadır.</p>
            )}
        </div>
    );
}
