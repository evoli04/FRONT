import React, { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import Card from './Card';
import '../components/css/List.css';

/**
 * Bu bileşen, bir panodaki listeyi ve içindeki kartları görüntüler.
 * Tema durumunu (isDarkTheme) prop olarak alır.
 * @param {Object} list - Liste verileri.
 * @param {Function} onUpdate - Listeyi güncelleme işlevi.
 * @param {Function} onDelete - Listeyi silme işlevi.
 * @param {boolean} isDarkTheme - Koyu tema aktifse 'true', değilse 'false'.
 */
export default function List({ list, onUpdate, onDelete, isDarkTheme }) {
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

    // isDarkTheme prop'una göre CSS sınıfını dinamik olarak belirliyoruz
    const listClass = isDarkTheme ? 'list-container dark' : 'list-container';
    const cardFormClass = isDarkTheme ? 'add-card-form dark' : 'add-card-form';
    const addButtonClass = isDarkTheme ? 'add-card-button dark' : 'add-card-button';

    return (
        <div className={listClass}>
            <div className="list-header">
                <h3 className="list-title">{list.title}</h3>
                <button
                    className="delete-list-button"
                    onClick={onDelete}
                    aria-label="Listeyi sil"
                >
                    <FiTrash2 size={16} />
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
                        isDarkTheme={isDarkTheme}
                    />
                ))}
            </div>

            {showCardForm ? (
                <div className={cardFormClass}>
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
                    className={addButtonClass}
                    onClick={() => setShowCardForm(true)}
                >
                    <FiPlus size={14} /> Kart Ekle
                </button>
            )}
        </div>
    );
}
