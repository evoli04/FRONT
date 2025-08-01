import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import '../components/css/workspace.css';

export default function List({ listName, onAddCard }) {
    const [cards, setCards] = useState([]);
    const [newCardTitle, setNewCardTitle] = useState('');

    const handleAddCard = () => {
        if (!newCardTitle.trim()) return;
        const newCard = {
            id: Date.now(),
            title: newCardTitle
        };
        setCards([...cards, newCard]);
        setNewCardTitle('');
        if (onAddCard) onAddCard(listName, newCard);
    };

    return (
        <div className="list-container">
            <div className="list-title">{listName}</div>
            <div className="cards-container">
                {cards.map(card => (
                    <div key={card.id} className="card-item">
                        {card.title}
                    </div>
                ))}
            </div>
            <div className="add-card-form">
                <input
                    type="text"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    placeholder="Kart adı"
                />
                <button onClick={handleAddCard}>
                    <FiPlus size={14} /> Kart Ekle
                </button>
            </div>
        </div>
    );
}