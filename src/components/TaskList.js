import React, { useState } from 'react';
import useTaskStore from '../stores/taskStore';

const TaskList = () => {
  const { tasks, editTask, deleteTask, toggleTaskCompletion } = useTaskStore();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [editedPriority, setEditedPriority] = useState('');

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditedText(task.text);
    setEditedPriority(task.priority || 'low'); // Default priority
  };

  const handleSaveClick = (id) => {
    editTask(id, { text: editedText, priority: editedPriority });
    setEditingTaskId(null);
  };

  return (
    <main className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id)}
          />
          {editingTaskId === task.id ? (
            <>
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <select
                value={editedPriority}
                onChange={(e) => setEditedPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button onClick={() => handleSaveClick(task.id)}>Save</button>
            </>
          ) : (
            <>
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text} (Priority: {task.priority})
              </span>
              <button onClick={() => handleEditClick(task)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </main>
  );
};

export default TaskList;