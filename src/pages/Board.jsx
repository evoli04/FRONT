import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../components/css/Board.css';
import BoardPopup from './BoardPopup.jsx';

export default function Board({ boards, onCreateBoardSubmit, workspaceId }) {
    const [showBoardPopup, setShowBoardPopup] = useState(false);
    const navigate = useNavigate();

    // BoardPopup'tan gelen veriyi işleyen fonksiyon
    const handleBoardPopupSubmit = async (boardTitle, bgColor) => {
        await onCreateBoardSubmit({
            workspaceId,
            title: boardTitle,
            bgColor: bgColor || '#ADD8E6', // Varsayılan renk
        });
        setShowBoardPopup(false);
    };

    // Panoya tıklanınca yönlendirme yapan fonksiyon
    const handleBoardClick = (boardId) => {
        if (!boardId) {
            console.error("Board ID is missing for navigation.");
            alert("Pano detayına gitmek için pano ID'si eksik.");
            return;
        }
       navigate(`/board/${boardId}`);

    };

    return (
        <div className="board-list">
            {boards && boards.length > 0 ? (
                <ul>
                    {boards.map((board) => (
                        <li
                            key={board.id}
                            onClick={() => handleBoardClick(board.id)}
                            className="board-item"
                            style={{ backgroundColor: board.bgColor || '#ADD8E6' }}
                        >
                            <span>{board.title}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-boards-message">Bu çalışma alanına ait pano bulunamadı.</p>
            )}

            <button className="add-board" onClick={() => setShowBoardPopup(true)}>
                <FiPlus size={14} /> Pano Ekle
            </button>
            <div className="divider"></div>

            {showBoardPopup && (
                <BoardPopup
                    onClose={() => setShowBoardPopup(false)}
                    onSubmit={handleBoardPopupSubmit}
                />
            )}
        </div>
    );
}