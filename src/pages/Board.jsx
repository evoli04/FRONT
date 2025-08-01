import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import '../components/css/Board.css';

export default function Board({ boards, onAddBoardClick }) {
    // State'ler
    const [expandedBoard, setExpandedBoard] = useState(null);
    const [lists, setLists] = useState({});
    const [newListTitle, setNewListTitle] = useState('');

    // Dummy veri yerine gerçek API çağrısı yapılabilir
    const fetchListsForBoard = (boardId) => {
        // Bu kısım backend entegrasyonu ile değiştirilecek
        const dummyLists = [
            { id: 1, title: 'Örnek Liste 1' },
            { id: 2, title: 'Örnek Liste 2' }
        ];
        setLists(prev => ({ ...prev, [boardId]: dummyLists }));
    };

    // Board'u genişlet/daralt
    const toggleBoard = (boardId) => {
        if (expandedBoard === boardId) {
            setExpandedBoard(null);
        } else {
            setExpandedBoard(boardId);
            if (!lists[boardId]) {
                fetchListsForBoard(boardId);
            }
        }
    };

    // Yeni liste ekle
    const addList = (boardId) => {
        if (!newListTitle.trim()) return;

        const newList = {
            id: Date.now(),
            title: newListTitle
        };

        setLists(prev => ({
            ...prev,
            [boardId]: [...(prev[boardId] || []), newList]
        }));

        setNewListTitle('');
    };

    return (
        <div className="board-list">
            <ul>
                {boards.map((board, idx) => (
                    <React.Fragment key={idx}>
                        <li onClick={() => toggleBoard(idx)} className="board-item">
                            <input type="checkbox" checked={true} readOnly />
                            <span>{board}</span>
                        </li>

                        {/* Genişletilmiş liste görünümü */}
                        {expandedBoard === idx && (
                            <div className="board-expanded">
                                {lists[idx]?.map(list => (
                                    <div key={list.id} className="list-item">
                                        {list.title}
                                    </div>
                                ))}

                                {/* Yeni liste ekleme formu */}
                                <div className="add-list-form">
                                    <input
                                        type="text"
                                        value={newListTitle}
                                        onChange={(e) => setNewListTitle(e.target.value)}
                                        placeholder="Liste adı"
                                        className="list-input"
                                    />
                                    <button
                                        onClick={() => addList(idx)}
                                        className="add-list-button"
                                    >
                                        <FiPlus size={14} /> Liste Ekle
                                    </button>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </ul>

            <button className="add-board" onClick={onAddBoardClick}>
                <FiPlus size={14} /> Pano Ekle
            </button>
            <div className="divider"></div>
        </div>
    );
}