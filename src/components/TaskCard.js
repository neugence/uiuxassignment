import React from "react";

const TaskCard = ({ task }) => {
  return (
    <div className="bg-gray-200 p-2 rounded mb-2 shadow">
      <p className="font-semibold">{task.title}</p>
    </div>
  );
};

export default TaskCard;
