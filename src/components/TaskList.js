import React from 'react';
import useTaskStore from '../stores/taskStore';

const TaskList = () => {
  const {
    getFilteredAndSortedTasks,
    currentPage,
    tasksPerPage,
    deleteTask,
    editTask,
    toggleTaskCompletion,
  } = useTaskStore();

  // Get filtered and sorted tasks
  const filteredTasks = getFilteredAndSortedTasks();

  // Calculate the tasks to display for the current page
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <main className="task-list">
      {currentTasks.map((task) => (
        <div key={task.id} className="task">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id)}
          />
          <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.text}
          </span>
          <button onClick={() => editTask(task.id, { text: 'Updated Task' })}>
            Edit
          </button>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </main>
  );
};

export default TaskList;