import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import '../components/css/Board.css';

export default function Board({ boards, onAddBoardClick }) {
    // State'ler
    const [expandedBoard, setExpandedBoard] = useState(null);

    // Board'u genişlet/daralt
    const toggleBoard = (boardId) => {
        if (expandedBoard === boardId) {
            setExpandedBoard(null);
        } else {
            setExpandedBoard(boardId);
        }
    };

    return (
        <div className="board-list">
            <ul>
                {boards.map((board, idx) => (
                    <React.Fragment key={idx}>
                        <li onClick={() => toggleBoard(idx)} className="board-item">
                            <span>{board}</span>
                        </li>

                        {expandedBoard === idx && (
                            <div className="board-expanded">
                                {/* Buraya board içeriği eklenebilir */}
                                <div className="board-content">
                                    {board} panosunun içeriği
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