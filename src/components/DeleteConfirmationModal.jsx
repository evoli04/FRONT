import React from 'react';
import './css/DeleteConfirmationModal.css';

export default function DeleteConfirmationModal({
    message = "Bu öğeyi silmek istediğinize emin misiniz?",
    confirmText = "Sil",
    cancelText = "İptal",
    onConfirm,
    onCancel,
    isDarkTheme = false
}) {
    return (
        <div className={`modal-overlay ${isDarkTheme ? 'dark' : ''}`}>
            <div className={`modal-content ${isDarkTheme ? 'dark' : ''}`}>
                <div className="modal-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V12" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16H12.01" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button className="modal-cancel-btn" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className="modal-confirm-btn" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}