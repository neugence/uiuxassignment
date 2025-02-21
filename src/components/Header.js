import React, { useState } from 'react';
import useTaskStore from '../stores/taskStore';

const Header = () => {
  const [newTask, setNewTask] = useState('');
  const { addTask } = useTaskStore();

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask({ text: newTask });
      setNewTask('');
    }
  };

  return (
    <header className="header">
      <h1>Smart Task Manager</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button className="add-task-button" onClick={handleAddTask}>
          + Add Task
        </button>
      </div>
    </header>
  );
};

export default Header;