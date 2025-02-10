
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskColumn from "./components/TaskColumn";
import TaskModal from "./components/TaskModal";

const initialColumns = [
  { id: "general", title: "General Information", tasks: [] },
  { id: "backlog", title: "Backlog", tasks: [] },
  { id: "in-progress", title: "In Progress", tasks: [] },
  { id: "paused", title: "Paused", tasks: [] },
  { id: "launch", title: "Ready for Launch", tasks: [] },
];

const TaskManager = () => {
  const [view, setView] = useState("taskManager"); // Toggle state
  const [columns, setColumns] = useState(initialColumns);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", assignees: [], status: "", startDate: "", endDate: "" });

  const openModal = (columnId) => {
    setSelectedColumn(columnId);
    setNewTask((prev) => ({ ...prev, status: columnId }));
    setModalOpen(true);
  };

  const addTask = () => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === newTask.status ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    );
    setModalOpen(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 bg-gray-200 min-h-screen flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

        {/* Toggle Button */}
        <button
          onClick={() => setView(view === "taskManager" ? "dashboard" : "taskManager")}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Switch to {view === "taskManager" ? "Members Dashboard" : "Task Manager"}
        </button>

        {/* Conditional Rendering */}
        {view === "taskManager" ? (
          <div className="flex flex-row w-full gap-4 overflow-x-auto">
            {columns.map((col) => (
              <div
                key={col.id}
                className="w-72 bg-white p-4 rounded-lg shadow-md flex flex-col border"
              >
                <div className="flex-1 h-72 mb-4">
                  <TaskColumn column={col} />
                </div>

                <button 
                  onClick={() => openModal(col.id)} 
                  className="mt-auto w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex items-center justify-center"
                >
                  + Add a card
                </button>
              </div>
            ))}
          </div>
        ) : (
          <MembersDashboard />
        )}

        {modalOpen && <TaskModal setNewTask={setNewTask} addTask={addTask} setModalOpen={setModalOpen} />}
      </div>
    </DndProvider>
  );
};

const members = [
  { id: 1, name: "Karen", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, name: "Jake", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, name: "Brad", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: 4, name: "Molly", avatar: "https://i.pravatar.cc/40?img=4" }
];

const tasks = [
  { id: 1, memberId: 1, title: "Review Main Page", color: "bg-yellow-300", start: 1, duration: 2 },
  { id: 2, memberId: 1, title: "Profile", color: "bg-blue-300", start: 5, duration: 3 },
  { id: 3, memberId: 2, title: "New Feature QA", color: "bg-green-300", start: 2, duration: 2 },
  { id: 4, memberId: 2, title: "Analytics", color: "bg-yellow-400", start: 4, duration: 3 },
  { id: 5, memberId: 3, title: "Optimization", color: "bg-blue-200", start: 3, duration: 4 },
  { id: 6, memberId: 3, title: "Refactoring", color: "bg-blue-300", start: 7, duration: 3 },
  { id: 7, memberId: 4, title: "Main Page Update", color: "bg-purple-300", start: 4, duration: 3 },
  { id: 8, memberId: 4, title: "Images Blog Post", color: "bg-green-200", start: 7, duration: 3 }
];

const MembersDashboard = () => {
  return (
    <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Members Dashboard</h2>
      <div className="border rounded-lg bg-gray-100 p-4 overflow-x-auto">
        <div className="grid grid-cols-12 gap-2 text-gray-700 text-sm font-semibold mb-2">
          <span className="col-span-2">Member</span>
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-center">Day {i + 1}</span>
          ))}
        </div>
        <div>
          {members.map((member) => (
            <div key={member.id} className="grid grid-cols-12 items-center gap-2 mb-3">
              <div className="col-span-2 flex items-center gap-2">
                <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                <span>{member.name}</span>
              </div>
              <div className="col-span-10 relative h-10">
                {tasks
                  .filter((task) => task.memberId === member.id)
                  .map((task) => (
                    <div
                      key={task.id}
                      className={`absolute ${task.color} px-3 py-1 text-xs rounded-md shadow-md text-white`} 
                      style={{ left: `${task.start * 10}%`, width: `${task.duration * 10}%` }}
                    >
                      {task.title}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
