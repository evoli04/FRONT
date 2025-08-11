import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/css/List.css'; // CSS yolu muhtemelen değişmedi
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'; // Modal yolunu güncelledik
import Card from './Card'; // Pages klasöründeki Card bileşenini import edin

/**
 * Bu bileşen, bir panodaki listeyi ve içindeki kartları görüntüler.
 * Veri yönetimi ve API çağrıları, üst bileşen olan BoardPage tarafından yapılır.
 *
 * @param {Object} list - Liste verileri.
 * @param {Function} onListDelete - Listeyi silme işlevi.
 * @param {Function} onCardAdd - Yeni kart ekleme işlevi.
 * @param {Function} onCardUpdate - Kart güncelleme işlevi.
 * @param {Function} onCardDelete - Kart silme işlevi.
 * @param {boolean} isDarkTheme - Koyu tema aktifse 'true', değilse 'false'.
 */
export default function List({ list, onListDelete, onCardAdd, onCardUpdate, onCardDelete, isDarkTheme }) {
    const [newCardTitle, setNewCardTitle] = useState('');
    const [showCardForm, setShowCardForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal durumunu yönetmek için yeni state

    // Temaya göre dinamik olarak CSS sınıflarını belirliyoruz
    const listClass = isDarkTheme ? 'list-container dark' : 'list-container';
    const cardFormClass = isDarkTheme ? 'add-card-form dark' : 'add-card-form';
    const addButtonClass = isDarkTheme ? 'add-card-button dark' : 'add-card-button';

    const handleAddCard = async () => {
        if (!newCardTitle.trim()) {
            toast.warn('Kart başlığı boş olamaz!');
            return;
        }
        try {
            await onCardAdd({
                title: newCardTitle,
                listId: list.listId,
            });
            setNewCardTitle('');
            setShowCardForm(false);
            toast.success('Kart başarıyla eklendi!');
        } catch (error) {
            console.error("Kart eklenirken hata oluştu:", error);
            toast.error('Kart eklenirken bir hata oluştu.');
        }
    };

    /**
     * Modal üzerinden onaylandıktan sonra listeyi silme işlemini gerçekleştirir.
     */
    const confirmAndDeleteList = async () => {
        try {
            await onListDelete(list.listId);
            toast.success('Liste başarıyla silindi!');
        } catch (error) {
            console.error("Liste silinirken hata oluştu:", error);
            toast.error('Liste silinirken bir hata oluştu.');
        } finally {
            setShowDeleteModal(false); // İşlem bitince veya hata olsa bile modalı kapat
        }
    };

    const cards = Array.isArray(list.cards) ? list.cards : [];

    return (
        <div className={listClass}>
             {showDeleteModal && (
                <DeleteConfirmationModal
                    message={`"${list.title}" adlı listeyi silmek istediğinizden emin misiniz?`}
                    onConfirm={confirmAndDeleteList}
                    onCancel={() => setShowDeleteModal(false)}
                    isDarkTheme={isDarkTheme} // isDarkTheme prop'unu ekledik
                />
            )}

            <div className="list-header">
                <h3 className="list-title">{list.title}</h3>
                <button
                    className="delete-list-button"
                    onClick={() => setShowDeleteModal(true)} // Tıklanınca modalı aç
                    aria-label="Listeyi sil"
                >
                    <FiTrash2 size={16} />
                </button>
            </div>

            <div className="cards-container">
                {cards.length > 0 ? (
                    cards.map((card) => (
                        <Card
                            key={card.cardId}
                            card={card}
                            onUpdate={onCardUpdate}
                            onDelete={onCardDelete}
                            isDarkTheme={isDarkTheme}
                        />
                    ))
                ) : (
                    <p className="empty-list-message">Bu listede hiç kart yok.</p>
                )}
            </div>

            {showCardForm ? (
                <div className={cardFormClass}>
                    <input
                        type="text"
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddCard();
                            }
                        }}
                        placeholder="Kart başlığı girin"
                        autoFocus
                    />
                    <div className="form-actions">
                        <button
                            className="add-button"
                            onClick={handleAddCard}
                            aria-label="Kartı ekle"
                        >
                            Kart Ekle
                        </button>
                        <button
                            className="cancel-button"
                            onClick={() => setShowCardForm(false)}
                            aria-label="İptal et"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    className={addButtonClass}
                    onClick={() => setShowCardForm(true)}
                    aria-label="Yeni kart ekle"
                >
                    <FiPlus size={14} /> Kart Ekle
                </button>
            )}
        </div>
    );
}