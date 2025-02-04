import React from "react";
import useTaskStore from "../../store/taskStore";

const TaskDebug = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const filters = useTaskStore((state) => state.filters);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg max-w-md">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="text-sm">
        <div className="mb-2">
          <strong>Total Tasks:</strong> {tasks.size}
        </div>
        <div className="mb-2">
          <strong>Active Filters:</strong>
          <pre className="bg-gray-100 p-2 rounded mt-1">
            {JSON.stringify(filters, null, 2)}
          </pre>
        </div>
        <div>
          <strong>Tasks:</strong>
          <pre className="bg-gray-100 p-2 rounded mt-1 max-h-40 overflow-auto">
            {JSON.stringify(Array.from(tasks.entries()), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TaskDebug;
