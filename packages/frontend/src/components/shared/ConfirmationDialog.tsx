import React from 'react';

export type ConfirmationDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-2xl">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button className="bg-red-500 text-white px-4 py-1" onClick={onConfirm}>
            Confirmar
          </button>
          <button className="bg-gray-500 text-white px-4 py-1" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
