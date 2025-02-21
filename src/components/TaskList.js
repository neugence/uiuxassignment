import React from 'react';

const TaskList = () => {
  return (
    <main className="task-list">
      <div className="task">
        <span>Task 1</span>
        <button>Edit</button>
        <button>Delete</button>
      </div>
      <div className="task">
        <span>Task 2</span>
        <button>Edit</button>
        <button>Delete</button>
      </div>
      {/* Add more tasks here */}
    </main>
  );
};

export default TaskList;