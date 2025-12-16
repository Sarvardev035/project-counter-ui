// Modal component
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-600 text-base mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="btn-secondary px-6 py-2.5"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-lg text-white transition-all duration-200 font-semibold shadow-lg hover:shadow-xl active:scale-95 ${
              isDangerous
                ? 'btn-danger'
                : 'btn-primary'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
