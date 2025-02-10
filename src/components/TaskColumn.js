import React from "react";
import TaskCard from "./TaskCard";

const TaskColumn = ({ column }) => {
  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-2">{column.title}</h2>
      {column.tasks.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}
    </div>
  );
};

export default TaskColumn;
