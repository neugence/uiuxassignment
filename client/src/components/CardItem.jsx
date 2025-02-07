import React from "react";
import Card from "./Card";

const CardItem = ({ tasks }) => {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {tasks.map((task) => (
        <Card key={task.id} task={task} />
      ))}
    </div>
  );
};

export default CardItem;
