import React, { useContext } from "react";
import { MessageSquare, Eye, Calendar } from "lucide-react";
import { GlobalContext } from "../context/GlobalContext";

const Card = ({ task }) => {
  const { openModal } = useContext(GlobalContext);
  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-400",
    Low: "bg-green-500",
  };
  return (
    <div
      className="bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => {
        openModal(task);
      }}
    >
      <div className="flex gap-1 mb-2">
        {task.tags?.length > 0 ? (
          task.tags.map((tag, index) => (
            <span
              key={index}
              className={`h-1.5 w-8 rounded-full ${
                priorityColors[tag] || "bg-gray-400"
              }`}
            />
          ))
        ) : (
          <span className="h-1.5 w-8 rounded-full bg-gray-400" />
        )}
      </div>
      <h3 className="font-medium text-gray-800 mb-2">{task.title}</h3>
      <div className="mb-2 pt-0">
        <p className="text-xs text-gray-500">{task.subtitle}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <Calendar className="h-4 w-4" />
          <span>
            {task.startDate
              ? new Date(task.startDate).toLocaleDateString()
              : "No Start Date"}
            {task.endDate
              ? ` - ${new Date(task.endDate).toLocaleDateString()}`
              : ""}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Eye size={16} className="mr-1" />
            <span>{task.views}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare size={16} className="mr-1" />
            <span>{task.comments}</span>
          </div>
        </div>
        <div className="flex -space-x-2">
          {Array.isArray(task.assignees) &&
            task.assignees.map((assignee) => (
              <img
                key={assignee.id}
                src={assignee.avatar}
                alt={assignee.name}
                className="w-6 h-6 rounded-full border-2 border-white"
                title={assignee.name}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
