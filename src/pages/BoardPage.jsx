import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import '../components/css/workspace.css';
import List from './List.jsx';

export default function BoardPage() {
    const { workspaceId, boardName } = useParams();
    const navigate = useNavigate();

    const [lists, setLists] = useState([]);
    const [newListTitle, setNewListTitle] = useState('');

    const handleAddList = () => {
        if (!newListTitle.trim()) return;

        const newList = {
            id: Date.now(),
            title: newListTitle,
        };

        setLists([...lists, newList]);
        setNewListTitle('');
    };

    return (
        <div className="board-page">
            <header className="board-header">
                <h1>{decodeURIComponent(boardName)}</h1>
                {/* Burada /workspace yoluna yönlendirme yapıyoruz */}
                <button onClick={() => navigate('/workspace')}>Çalışma Alanlarına Dön</button>
            </header>

            <div className="lists-container">
                {lists.map((list) => (
                    <List key={list.id} title={list.title} />
                ))}

                <div className="add-list-form">
                    <input
                        type="text"
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        placeholder="Liste adı"
                    />
                    <button onClick={handleAddList}>
                        <FiPlus size={14} /> Liste Ekle
                    </button>
                </div>
            </div>
        </div>
    );
}