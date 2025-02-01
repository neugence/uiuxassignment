import React from 'react';

const TaskCard = ({ task }) => {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>Assignee: {task.assignee}</p>
      <p>Start Date: {task.startDate}</p>
      <p>End Date: {task.endDate}</p>
    </div>
  );
};

export default TaskCard;