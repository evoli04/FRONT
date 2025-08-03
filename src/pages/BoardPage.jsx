// BoardPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

import List from './List.jsx';
import '../components/css/BoardPage.css';
import Card from './Card.jsx';

export default function BoardPage() {
    const { boardName } = useParams();
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [showListForm, setShowListForm] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');

    const handleAddList = () => {
        if (!newListTitle.trim()) return;
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
                <h1>{decodeURIComponent(boardName)}</h1>
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