import React from 'react';
import './css/DeleteConfirmationModal.css'; // CSS yolunu güncelledik

export default function DeleteConfirmationModal({
    message,
    onConfirm,
    onCancel,
    isDarkTheme,
}) {
    const modalClass = isDarkTheme ? 'modal-overlay dark' : 'modal-overlay';
    const contentClass = isDarkTheme ? 'modal-content dark' : 'modal-content';

    return (
        <div className={modalClass}>
            <div className={contentClass}>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button className="modal-confirm-btn" onClick={onConfirm}>
                        Sil
                    </button>
                    <button className="modal-cancel-btn" onClick={onCancel}>
                        İptal
                    </button>
                </div>
            </div>
        </div>
    );
}