// List.jsx
import React, { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import Card from './Card';
import '../components/css/List.css';

export default function List({ list, onUpdate, onDelete }) {
    const [newCardTitle, setNewCardTitle] = useState('');
    const [showCardForm, setShowCardForm] = useState(false);

    const handleAddCard = () => {
        if (!newCardTitle.trim()) return;
        const updatedList = {
            ...list,
            cards: [...list.cards, {
                id: Date.now(),
                title: newCardTitle,
                checklists: []
            }]
        };
        onUpdate(updatedList);
        setNewCardTitle('');
        setShowCardForm(false);
    };

    return (
        <div className="list-container">
            <div className="list-header">
                <h3 className="list-title">{list.title}</h3>
                <button
                    className="delete-list-button"
                    onClick={onDelete}
                >
                    <FiX size={16} />
                </button>
            </div>

            <div className="cards-container">
                {list.cards.map((card) => (
                    <Card
                        key={card.id}
                        card={card}
                        onUpdate={(updatedCard) => {
                            const updatedList = {
                                ...list,
                                cards: list.cards.map(c =>
                                    c.id === updatedCard.id ? updatedCard : c
                                )
                            };
                            onUpdate(updatedList);
                        }}
                        onDelete={() => {
                            const updatedList = {
                                ...list,
                                cards: list.cards.filter(c => c.id !== card.id)
                            };
                            onUpdate(updatedList);
                        }}
                    />
                ))}
            </div>

            {showCardForm ? (
                <div className="add-card-form">
                    <input
                        type="text"
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        placeholder="Kart başlığı girin"
                        autoFocus
                    />
                    <div className="form-actions">
                        <button
                            className="add-button"
                            onClick={handleAddCard}
                        >
                            Kart Ekle
                        </button>
                        <button
                            className="cancel-button"
                            onClick={() => setShowCardForm(false)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    className="add-card-button"
                    onClick={() => setShowCardForm(true)}
                >
                    <FiPlus /> Kart Ekle
                </button>
            )}
        </div>
    );
}