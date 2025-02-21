import React, { useState } from "react";

export default function SubtaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [note, setNote] = useState("");

  const handleSave = async () => {
    try {
      const newSubtask = {
        title,
        startDate,
        endDate,
        assignees,
        note,
        task: task._id,
      };

      await onSave(task._id, newSubtask);

      onClose();
    } catch (error) {
      console.error("Error saving subtask:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-lg w-full max-w-md border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">
          Add Subtask to {task.title}
        </h2>

        {/* Subtask Title */}
        <input
          type="text"
          placeholder="Subtask title"
          className="w-full border dark:border-gray-700 rounded p-2 mb-3 dark:bg-gray-800 dark:text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Start Date & End Date */}
        <div className="flex space-x-2 mb-3">
          <input
            type="date"
            placeholder="Start Date"
            className="w-1/2 border dark:border-gray-700 rounded p-2 dark:bg-gray-800 dark:text-white"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            placeholder="End Date"
            className="w-1/2 border dark:border-gray-700 rounded p-2 dark:bg-gray-800 dark:text-white"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Assignees */}
        <input
          type="text"
          placeholder="Assignees (comma-separated)"
          className="w-full border dark:border-gray-700 rounded p-2 mb-3 dark:bg-gray-800 dark:text-white"
          value={assignees.join(", ")}
          onChange={(e) => setAssignees(e.target.value.split(", "))}
        />

        {/* Note */}
        <textarea
          placeholder="Notes"
          className="w-full border dark:border-gray-700 rounded p-2 mb-3 dark:bg-gray-800 dark:text-white"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-500 dark:bg-gray-600 text-white px-3 py-1 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 dark:bg-blue-700 text-white px-3 py-1 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
