"use client";

import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  isConfirming = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal profile-modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-form">
          <p className="modal-message">{message}</p>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isConfirming}>
              Cancelar
            </button>
            <button type="button" onClick={onConfirm} className="btn-danger" disabled={isConfirming}>
              {isConfirming ? "Eliminando..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;