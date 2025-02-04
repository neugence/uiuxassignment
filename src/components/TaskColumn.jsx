import React from 'react';
import TaskCard from './TaskCard';

function TaskColumn({ column, tasks }) {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskColumn;
