import React, { useState } from 'react';
import useTaskStore from '../stores/taskStore';

const TaskList = () => {
  const { tasks, addTask, deleteTask, editTask, toggleTaskCompletion } = useTaskStore();
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingPriority, setEditingPriority] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask({ text: newTaskText });
      setNewTaskText('');
    }
  };

  // Starts editing a task by setting the editing state variables
  // with the task's current values
  const handleStartEdit = (task) => {
    setEditingTask(task.id);      // Set which task is being edited
    setEditingText(task.text);    // Set the initial edit text
    setEditingPriority(task.priority || '');  // Set initial priority, empty string if none
  };

  const handleSaveEdit = (id) => {
    const updates = { text: editingText };
    if (editingPriority) {
      updates.priority = parseInt(editingPriority);
    } else {
      updates.priority = undefined;
    }
    editTask(id, updates);
    setEditingTask(null);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <main className="task-list">
      {/* Add New Task Form */}
      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task"
          required
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      {tasks.map((task) => (
        <div key={task.id} className="task">
          {editingTask === task.id ? (
            <div className="edit-task-form">
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                placeholder="Task text"
              />
              <select
                value={editingPriority}
                onChange={(e) => setEditingPriority(e.target.value)}
              >
                <option value="">No Priority</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
              </select>
              <button onClick={() => handleSaveEdit(task.id)}>Save</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </div>
          ) : (
            <>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
              />
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text}
                {task.priority && (
                  <span className="priority-indicator">
                    {' '}(Priority: {task.priority === 1 ? 'Low' : task.priority === 2 ? 'Medium' : 'High'})
                  </span>
                )}
              </span>
              <button onClick={() => handleStartEdit(task)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </main>
  );
};

export default TaskList;