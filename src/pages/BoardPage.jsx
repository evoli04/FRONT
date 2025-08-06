// BoardPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

import List from './List.jsx'; // Varsayılan olarak list'in var olduğunu varsaydım
import '../components/css/BoardPage.css';

// Bu kısım, API'den liste ve kart verisi çekmek için
// gerekli endpoint'leriniz olduğunda doldurulmalıdır.
// Şimdilik statik veri ile devam ediyoruz.

export default function BoardPage() {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [showListForm, setShowListForm] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');

    // Not: Normalde burada boardId'ye göre panonun listelerini çekeceksiniz.
    // Örnek: useEffect(() => { fetchLists(boardId) }, [boardId]);

    const handleAddList = () => {
        if (!newListTitle.trim()) return;
        // Not: Buraya liste oluşturma endpoint'i entegre edilmeli.
        // Örnek: createList(boardId, newListTitle).then(newList => ...);
        setLists([...lists, {
            id: Date.now(),
            title: newListTitle,
            cards: []
        }]);
        setNewListTitle('');
        setShowListForm(false);
    };

    return (
        <div className="board-page">
            <div className="board-header">
                {/* <h1>{boardId}</h1> */}
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
                        onUpdate={(updatedList) => {
                            setLists(lists.map(l => l.id === updatedList.id ? updatedList : l));
                        }}
                        onDelete={() => {
                            setLists(lists.filter(l => l.id !== list.id));
                        }}
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