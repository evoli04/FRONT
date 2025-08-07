import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/css/List.css';
import Card from './Card';

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
            // Üst bileşenden gelen onCardAdd fonksiyonunu çağırıyoruz.
            // Bu fonksiyon, API çağrısını yapacak ve panoyu güncelleyecektir.
            await onCardAdd(list.id, {
                title: newCardTitle,
                listId: list.id,
            });
    
            setNewCardTitle('');
            setShowCardForm(false);
            toast.success('Kart başarıyla eklendi!');
        } catch (error) {
            console.error("Kart eklenirken hata oluştu:", error);
            // Hata mesajını kullanıcıya göstermek için toast kullanıyoruz
            toast.error('Kart eklenirken bir hata oluştu.');
        }
    };

    // >>> BURADAKİ GÜNCELLEME BAŞLIYOR <<<
    // 'list.cards' verisinin bir dizi olup olmadığını kontrol ediyoruz.
    // Eğer null, undefined veya başka bir türde ise, varsayılan olarak boş bir dizi kullanıyoruz.
    // Bu, '.map()' fonksiyonunun hata vermesini engeller.
    const cards = Array.isArray(list.cards) ? list.cards : [];
    // >>> GÜNCELLEME SONA ERİYOR <<<

    return (
        <div className={listClass}>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={isDarkTheme ? 'dark' : 'light'}
            />
            <div className="list-header">
                <h3 className="list-title">{list.title}</h3>
                <button
                    className="delete-list-button"
                    onClick={() => onListDelete(list.id)}
                    aria-label="Listeyi sil"
                >
                    <FiTrash2 size={16} />
                </button>
            </div>

            <div className="cards-container">
                {/* Artık 'cards' değişkeninin kesinlikle bir dizi olduğunu biliyoruz. */}
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        card={card}
                        onUpdate={(updatedCard) => onCardUpdate(list.id, updatedCard)}
                        onDelete={() => onCardDelete(list.id, card.id)}
                        isDarkTheme={isDarkTheme}
                    />
                ))}
                {/* Eğer kart yoksa bir placeholder göstermek isterseniz buraya ekleyebilirsiniz */}
                {cards.length === 0 && <p className="empty-list-message">Bu listede hiç kart yok.</p>}
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
