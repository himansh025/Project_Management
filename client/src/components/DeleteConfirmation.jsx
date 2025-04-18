import React from 'react';

const DeleteConfirmation = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow p-6 w-[90%] md:w-96">
        <p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
