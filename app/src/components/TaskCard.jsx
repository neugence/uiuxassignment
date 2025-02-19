import React from "react";
import { MdStart } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";

const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  return (
    <div className="card glass shadow-xl p-3">
      <div className="card-body">
        <h2 className="card-title font-bold justify-evenly text-indigo-950 capitalize">
          {task.title}
          {task.completed && (
            <span className="badge font-medium badge-success text-white ml-2">
              Completed
            </span>
          )}
        </h2>

        <div className="flex items-center font-semibold space-x-2 my-2">
          {task.assignee && (
            <>
              <img
                src={task.assignee.dp}
                alt={task.assignee.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm text-pretty">{task.assignee.name}</span>
            </>
          )}
        </div>

        <p>{task.description}</p>

        <div className="flex mb-2 justify-evenly gap-4 p-1">
          <p className=" badge badge-secondary text-sm font-normal ">
            {task.startDate ? `A : ${task.startDate}` : <MdStart />}
          </p>
          <p className="badge badge-secondary text-sm font-normal">
            {task.endDate ? `Z : ${task.endDate}` : <FaRegCalendarAlt />}
          </p>
        </div>

        <div className="card-actions justify-end">
          <button onClick={() => onToggle(task.id)} className="btn btn-sm">
            {task.completed ? "Undo" : "Complete"}
          </button>
          <button
            onClick={() => onEdit(task.id)}
            className="btn btn-sm btn-info"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="btn btn-sm btn-error"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
