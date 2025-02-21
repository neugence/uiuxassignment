import React, { memo } from "react";
import SubtaskItem from "./SubtaskItem";
import { Plus, Eye } from "lucide-react";

const TaskCard = memo(
  ({
    task,
    setTasks,
    setSelectedTask,
    setIsSubtaskModalOpen,
    navigate,
    setSubtaskToDelete,
    setIsDeleteModalOpen,
  }) => {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {task.title}
            </h2>
            <div className="flex space-x-2">
              <button
                className="text-blue-500 dark:text-blue-400 hover:text-blue-700"
                onClick={() => {
                  setSelectedTask(task);
                  setIsSubtaskModalOpen(true);
                }}
                aria-label="Add Subtask"
              >
                <Plus className="w-6 h-6" />
              </button>
              <button
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700"
                onClick={() =>
                  navigate(`/task/${task._id}`, { state: { task } })
                }
                aria-label="View Task"
              >
                <Eye className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          {task.subtasks.length > 0 ? (
            <div className="space-y-3">
              {task.subtasks.map((sub) => (
                <SubtaskItem
                  key={sub._id}
                  sub={sub}
                  task={task}
                  setTasks={setTasks}
                  setSubtaskToDelete={setSubtaskToDelete}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              No subtasks found.
            </p>
          )}
        </div>
      </div>
    );
  }
);

export default TaskCard;
