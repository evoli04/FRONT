// src/components/BoardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';

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
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [showListForm, setShowListForm] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API'den listeleri çeken fonksiyon. useCallback ile performansı artırıyoruz.
    const fetchLists = useCallback(async () => {
        if (!boardId) {
            setError("Geçersiz pano ID'si.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Doğru endpoint'i kullanarak listeleri çekiyoruz.
            // Bu, 'api.js' dosyasındaki 'getListsByBoard' fonksiyonunu kullanır.
            const data = await getListsByBoard(boardId);
            setLists(data);
        } catch (err) {
            console.error("Listeler alınırken hata oluştu:", err);

            // Hata tipine göre daha ayrıntılı mesajlar verelim
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

    // Bileşen yüklendiğinde ve boardId değiştiğinde listeleri çekiyoruz
    useEffect(() => {
        fetchLists();
    }, [fetchLists]);

    // Yeni liste oluşturma fonksiyonu
    const handleAddList = async () => {
        if (!newListTitle.trim()) return;

        try {
            // API'ye yeni liste oluşturma isteği gönderiyoruz
            await createList({ boardId, title: newListTitle });
            setNewListTitle('');
            setShowListForm(false);
            fetchLists(); // Listenin güncel halini almak için listeleri yeniden çekiyoruz
        } catch (err) {
            console.error("Liste oluşturulurken hata oluştu:", err);
            setError("Liste oluşturulurken bir hata oluştu.");
        }
    };

    // Liste silme fonksiyonu
    const handleListDelete = async (listId) => {
        try {
            await deleteList(listId);
            fetchLists(); // Panonun güncel halini almak için listeleri yeniden çekiyoruz
        } catch (err) {
            console.error("Liste silinirken hata oluştu:", err);
            setError("Liste silinirken bir hata oluştu.");
        }
    };

    // Kart ekleme fonksiyonu (List bileşenine prop olarak verilecek)
    const handleCardAdd = async (listId, cardData) => {
        try {
            await createCard({ ...cardData, listId });
            fetchLists(); // Panonun güncel halini almak için listeleri yeniden çekiyoruz
        } catch (err) {
            console.error("Kart oluşturulurken hata oluştu:", err);
            setError("Kart oluşturulurken bir hata oluştu.");
        }
    };

    // Kart güncelleme fonksiyonu (List bileşenine prop olarak verilecek)
    const handleCardUpdate = async (updatedCard) => {
        try {
            await updateCard(updatedCard.id, updatedCard);
            fetchLists(); // Panonun güncel halini almak için listeleri yeniden çekiyoruz
        } catch (err) {
            console.error("Kart güncellenirken hata oluştu:", err);
            setError("Kart güncellenirken bir hata oluştu.");
        }
    };

    // Kart silme fonksiyonu (List bileşenine prop olarak verilecek)
    const handleCardDelete = async (cardId) => {
        try {
            await deleteCard(cardId);
            fetchLists(); // Panonun güncel halini almak için listeleri yeniden çekiyoruz
        } catch (err) {
            console.error("Kart silinirken hata oluştu:", err);
            setError("Kart silinirken bir hata oluştu.");
        }
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
                <button
                    className="return-button"
                    onClick={() => navigate('/workspace')}
                >
                    Çalışma Alanlarına Dön
                </button>
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
        </div>
    );
}
