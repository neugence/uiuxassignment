import React from "react";
import Button from "./Button";

const TaskModal = ({ setNewTask, addTask, setModalOpen }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Add Card Modal</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Title"
          onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
        />
        <select
          className="border p-2 w-full mb-2"
          onChange={(e) => setNewTask((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="general">General Information</option>
          <option value="backlog">Backlog</option>
          <option value="in-progress">In Progress</option>
          <option value="paused">Paused</option>
          <option value="launch">Ready for Launch</option>
        </select>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Start Date"
          type="date"
          onChange={(e) => setNewTask((prev) => ({ ...prev, startDate: e.target.value }))}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="End Date"
          type="date"
          onChange={(e) => setNewTask((prev) => ({ ...prev, endDate: e.target.value }))}
        />
        <div className="mt-4 flex gap-2">
          <Button onClick={addTask}>Add</Button>
          <Button onClick={() => setModalOpen(false)} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
