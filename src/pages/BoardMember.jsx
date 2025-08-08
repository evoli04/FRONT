// src/components/BoardMembersPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getBoardMembers } from '../services/api';
import '../components/css/BoardMember.css';

export default function BoardMembersPage() {
    // URL'den workspaceId ve boardId'yi alıyoruz
    const { workspaceId, boardId } = useParams();
    const navigate = useNavigate();

    // Üyeleri ve yükleme/hata durumunu yönetmek için state'ler
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API'den üyeleri çeken fonksiyon
    const fetchBoardMembers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBoardMembers(boardId);

            // API'den gelen verinin bir dizi olup olmadığını kontrol ediyoruz.
            // Dizi değilse veya boşsa, boş bir dizi olarak ayarlanır.
            if (Array.isArray(data)) {
                // API yanıt yapısı, nested bir 'member' objesi içeriyor.
                // Bu yüzden doğrudan `data`'yı state'e atayabiliriz.
                setMembers(data);
                console.log(`Çalışma Alanı ${workspaceId} içerisindeki Pano ${boardId} için üyeler başarıyla çekildi.`);
            } else {
                console.error("API'den beklenen dizi formatında bir veri dönmedi. State boş dizi olarak ayarlanıyor.", data);
                setMembers([]);
            }
        } catch (err) {
            console.error('Üyeler alınırken hata oluştu:', err);
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    setError(`Sunucu hatası: ${err.response.status} - ${err.response.data?.message || 'Bilinmeyen Hata'}`);
                } else if (err.request) {
                    setError("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı ve sunucunuzun açık olduğunu kontrol edin.");
                } else {
                    setError("İstek ayarlanırken bir hata oluştu.");
                }
            } else {
                setError('Beklenmedik bir hata oluştu.');
            }
        } finally {
            setLoading(false);
        }
    }, [boardId, workspaceId]);

    // Bileşen yüklendiğinde üyeleri çek
    useEffect(() => {
        fetchBoardMembers();
    }, [fetchBoardMembers]);

    // Panoya geri dönmek için buton fonksiyonu
    const handleReturnToBoard = () => {
        // Doğru rotaya yönlendirme yapılıyor
        navigate(`/workspace/${workspaceId}/board/${boardId}`);
    };

    return (
        <div className="board-members-page">
            <div className="board-members-header">
                <h1>Pano Üyeleri - Pano {boardId}</h1>
                <button onClick={handleReturnToBoard} className="return-to-board-button">
                    Panoya Geri Dön
                </button>
            </div>
            <div className="board-members-content">
                {loading ? (
                    <p>Üyeler yükleniyor...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <>
                        <p>Bu panonun üyeleri aşağıda listelenmektedir.</p>
                        <ul className="members-list">
                            {members.length > 0 ? (
                                members.map(item => ( // 'member' yerine 'item' adını kullandım, böylece daha az kafa karıştırıcı olur.
                                    <li key={item.boardMemberId} className="member-item">
                                        <strong>{item.member.name} {item.member.surname}</strong> ({item.member.email})
                                    </li>
                                ))
                            ) : (
                                <p>Bu panoda henüz üye bulunmamaktadır.</p>
                            )}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}
