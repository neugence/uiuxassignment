import React, { memo } from "react";

const DeleteModal = memo(({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Are you sure you want to delete this subtask?
        </h2>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-500"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-500"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});

export default DeleteModal;
