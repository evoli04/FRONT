// src/components/BoardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';

// AddBoardMemberPopup bileşenini import edin
import AddBoardMemberPopup from './AddBoardMemberPopup.jsx';

import List from './List.jsx';
import '../components/css/BoardPage.css';
import {
    getListsByBoard,
    createList,
    updateList,
    deleteList,
    createCard,
    updateCard,
    deleteCard
} from '../services/api';

export default function BoardPage() {
    // workspaceId'yi de useParams ile alıyoruz
    const { workspaceId, boardId } = useParams();
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [showListForm, setShowListForm] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);

    // ... (diğer fonksiyonlar aynı kalacak: fetchLists, handleAddList vb.)
    const fetchLists = useCallback(async () => {
        if (!boardId) {
            setError("Geçersiz pano ID'si.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await getListsByBoard(boardId);
            setLists(data);
        } catch (err) {
            console.error("Listeler alınırken hata oluştu:", err);
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    console.error("Sunucudan gelen hata yanıtı:", err.response.data);
                    console.error("Hata durumu:", err.response.status);
                    setError(`Sunucu hatası: ${err.response.status} - ${err.response.data?.message || 'Bilinmeyen Hata'}`);
                } else if (err.request) {
                    console.error("Sunucuya istek gönderilemedi:", err.request);
                    setError("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı ve sunucunuzun açık olduğunu kontrol edin.");
                } else {
                    setError("İstek ayarlanırken bir hata oluştu.");
                }
            } else {
                setError("Beklenmedik bir hata oluştu.");
            }
        } finally {
            setLoading(false);
        }
    }, [boardId]);

    useEffect(() => {
        fetchLists();
    }, [fetchLists]);

    const handleAddList = async () => {
        if (!newListTitle.trim()) return;
        try {
            await createList({ boardId, title: newListTitle });
            setNewListTitle('');
            setShowListForm(false);
            fetchLists();
        } catch (err) {
            console.error("Liste oluşturulurken hata oluştu:", err);
            setError("Liste oluşturulurken bir hata oluştu.");
        }
    };

    const handleListDelete = async (listId) => {
        try {
            await deleteList(listId);
            fetchLists();
        } catch (err) {
            console.error("Liste silinirken hata oluştu:", err);
            setError("Liste silinirken bir hata oluştu.");
        }
    };

    const handleCardAdd = async (listId, cardData) => {
        try {
            await createCard({ ...cardData, listId });
            fetchLists();
        } catch (err) {
            console.error("Kart oluşturulurken hata oluştu:", err);
            setError("Kart oluşturulurken bir hata oluştu.");
        }
    };

    const handleCardUpdate = async (updatedCard) => {
        try {
            await updateCard(updatedCard.id, updatedCard);
            fetchLists();
        } catch (err) {
            console.error("Kart güncellenirken hata oluştu:", err);
            setError("Kart güncellenirken bir hata oluştu.");
        }
    };

    const handleCardDelete = async (cardId) => {
        try {
            await deleteCard(cardId);
            fetchLists();
        } catch (err) {
            console.error("Kart silinirken hata oluştu:", err);
            setError("Kart silinirken bir hata oluştu.");
        }
    };

    // Yeni yönlendirme fonksiyonu
    const handleViewMembers = () => {
        // Doğru rotaya yönlendirme yapılıyor
        navigate(`/workspace/${workspaceId}/board/${boardId}/members`);
    };

    if (loading) {
        return (
            <div className="board-page">
                <div className="loading-container">
                    <p>Panonuz yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="board-page">
                <div className="error-container">
                    <p style={{ color: 'red' }}>{error}</p>
                    <button onClick={fetchLists}>Tekrar Dene</button>
                </div>
            </div>
        );
    }

    return (
        <div className="board-page">
            <div className="board-header">
                <h1>Pano {boardId}</h1>
                <div className="board-actions">
                    {/* Yeni eklenen buton */}
                    <button
                        className="view-members-button"
                        onClick={handleViewMembers} // Yeni fonksiyona tıklandığında çalışır
                    >
                        Pano Üyelerini Görüntüle
                    </button>
                    <button
                        className="add-member-button"
                        onClick={() => setShowAddMemberPopup(true)}
                    >
                        Üye Ekle
                    </button>
                    <button
                        className="return-button"
                        onClick={() => navigate('/workspace')}
                    >
                        Çalışma Alanlarına Dön
                    </button>
                </div>
            </div>

            <div className="lists-container">
                {lists.map((list) => (
                    <List
                        key={list.id}
                        list={list}
                        onListDelete={handleListDelete}
                        onCardAdd={handleCardAdd}
                        onCardUpdate={handleCardUpdate}
                        onCardDelete={handleCardDelete}
                    />
                ))}

                <div className="list-container add-list-container">
                    {showListForm ? (
                        <div className="add-list-form">
                            <input
                                type="text"
                                value={newListTitle}
                                onChange={(e) => setNewListTitle(e.target.value)}
                                placeholder="Liste başlığı girin"
                                autoFocus
                            />
                            <div className="form-actions">
                                <button
                                    className="add-button"
                                    onClick={handleAddList}
                                >
                                    Liste Ekle
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={() => setShowListForm(false)}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="add-list-button"
                            onClick={() => setShowListForm(true)}
                        >
                            <FiPlus /> Liste Ekle
                        </button>
                    )}
                </div>
            </div>

            {showAddMemberPopup && (
                <AddBoardMemberPopup
                    onClose={() => setShowAddMemberPopup(false)}
                    boardId={boardId}
                    workspaceId={selectedWorkspace.id}
                />
            )}
        </div>
    );
}