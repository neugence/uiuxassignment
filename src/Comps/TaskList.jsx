import React from 'react';

export default function TaskList({ tasks }) {
  const users = [...new Set(tasks.map(task => task.assignee))];

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">User Task List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => {
          const userTasks = tasks.filter(task => task.assignee === user);
          return (
            <div key={user} className="bg-white p-4 rounded shadow-lg">
              <h3 className="text-lg font-bold mb-2">{user}</h3>
              {userTasks.map(task => (
                <div key={task.id} className={`p-2 rounded text-sm mb-1 ${getStatusColor(task.status)}`}>
                  {task.title} ({task.status})
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Function to apply status-based colors
function getStatusColor(status) {
  const statusColors = {
    "Backlog": "bg-yellow-200",
    "In_Progress": "bg-green-200",
    "Ready for Launch": "bg-blue-200",
    "Paused": "bg-orange-200",
    "General Information": "bg-gray-200"
  };
  return statusColors[status] || "bg-white";
}
