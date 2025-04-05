import React from 'react'

type ConfirmDelModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message?: string;
};

const ConfirmDelModal: React.FC<ConfirmDelModalProps> = (
    {
        isOpen,
        onClose,
        onConfirm,
        message = "Are you sure you want to delete this?",
    }: {
        isOpen: boolean;
        onClose: () => void;
        onConfirm: () => void;
        message?: string;
    }
) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
                <p className="text-lg text-center mb-4">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDelModal