// Card.jsx
import React, { useState } from 'react';
import { FiPlus, FiX, FiCheck } from 'react-icons/fi';
import '../components/css/Card.css';

export default function Card({ card, onUpdate, onDelete }) {
    const [newChecklistItem, setNewChecklistItem] = useState('');
    const [showChecklistForm, setShowChecklistForm] = useState(false);

    const handleAddChecklist = () => {
        if (!newChecklistItem.trim()) return;
        const updatedCard = {
            ...card,
            checklists: [...card.checklists, {
                id: Date.now(),
                text: newChecklistItem,
                completed: false
            }]
        };
        onUpdate(updatedCard);
        setNewChecklistItem('');
        setShowChecklistForm(false);
    };

    const toggleChecklist = (itemId) => {
        const updatedCard = {
            ...card,
            checklists: card.checklists.map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            )
        };
        onUpdate(updatedCard);
    };

    return (
        <div className="card-container">
            <div className="card-header">
                <h4 className="card-title">{card.title}</h4>
                <button
                    className="delete-card-button"
                    onClick={onDelete}
                >
                    <FiX size={14} />
                </button>
            </div>

            {card.checklists.length > 0 && (
                <div className="checklists-container">
                    {card.checklists.map((item) => (
                        <div key={item.id} className="checklist-item">
                            <button
                                className={`check-box ${item.completed ? 'checked' : ''}`}
                                onClick={() => toggleChecklist(item.id)}
                            >
                                {item.completed && <FiCheck size={10} />}
                            </button>
                            <span className={item.completed ? 'completed' : ''}>
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {showChecklistForm ? (
                <div className="add-checklist-form">
                    <input
                        type="text"
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        placeholder="Checklist öğesi ekle"
                        autoFocus
                    />
                    <div className="form-actions">
                        <button
                            className="add-button"
                            onClick={handleAddChecklist}
                        >
                            Ekle
                        </button>
                        <button
                            className="cancel-button"
                            onClick={() => setShowChecklistForm(false)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    className="add-checklist-button"
                    onClick={() => setShowChecklistForm(true)}
                >
                    <FiPlus size={12} /> Öğe Ekle
                </button>
            )}
        </div>
    );
}