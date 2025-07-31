// BoardList.jsx
import React from 'react';
import { FiPlus } from 'react-icons/fi';
import '../components/css/Board.css';

export default function BoardList({ boards, onAddBoardClick }) {
    return (
        <div className="board-list">
            <ul>
                {boards.map((board, idx) => (
                    <li key={idx}>
                        <input type="checkbox" checked={true} readOnly />
                        {board}
                    </li>
                ))}
            </ul>
            <button className="add-board" onClick={onAddBoardClick}>
                <FiPlus size={14} /> Pano Ekle
            </button>
            <div className="divider"></div>
        </div>
    );
}