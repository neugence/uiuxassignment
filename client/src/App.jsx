// import React, { useState } from "react";
// import { DragDropContext } from "react-beautiful-dnd";
// import Header from "./components/layout/Header";
// import Sidebar from "./components/layout/Sidebar";
// import TaskList from "./components/task/TaskList";
// import TaskModal from "./components/task/TaskModal";
// import TaskFilters from "./components/task/TaskFilters";
// import Statistics from "./components/dashboard/Statistics";
// import Timeline from "./components/dashboard/Timeline";
// import useTaskStore from "./store/taskStore";
// import { LayoutDashboard, Calendar } from "lucide-react";
// import TaskDebug from "./components/task/TaskDebug";

// const App = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [view, setView] = useState("board"); // 'board' or 'timeline'
//   const updateTask = useTaskStore((state) => state.updateTask);
//   const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;

//     const { draggableId, destination } = result;
//     updateTask(draggableId, { status: destination.droppableId });
//   };

//   const handleCreateTask = () => {
//     setSelectedTask(null);
//     setIsModalOpen(true);
//   };

//   const handleEditTask = (task) => {
//     setSelectedTask(task);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedTask(null);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar onCreateTask={handleCreateTask} />

//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header />

//         <main className="flex-1 overflow-y-auto">
//           <div className="container mx-auto px-4 py-6">
//             {/* View Toggle */}
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {view === "board" ? "Task Board" : "Timeline View"}
//               </h1>

//               <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
//                 <button
//                   onClick={() => setView("board")}
//                   className={`
//                     flex items-center gap-2 px-4 py-2 rounded-md
//                     ${
//                       view === "board"
//                         ? "bg-blue-100 text-blue-600"
//                         : "text-gray-600 hover:bg-gray-100"
//                     }
//                   `}
//                 >
//                   <LayoutDashboard size={20} />
//                   <span>Board</span>
//                 </button>

//                 <button
//                   onClick={() => setView("timeline")}
//                   className={`
//                     flex items-center gap-2 px-4 py-2 rounded-md
//                     ${
//                       view === "timeline"
//                         ? "bg-blue-100 text-blue-600"
//                         : "text-gray-600 hover:bg-gray-100"
//                     }
//                   `}
//                 >
//                   <Calendar size={20} />
//                   <span>Timeline</span>
//                 </button>
//               </div>
//             </div>

//             {/* Statistics Dashboard */}
//             <Statistics />

//             {/* Filters */}
//             <TaskFilters />

//             {/* Task Board / Timeline */}
//             <DragDropContext onDragEnd={handleDragEnd}>
//               {view === "board" ? (
//                 <TaskList onEditTask={handleEditTask} />
//               ) : (
//                 <Timeline />
//               )}
//             </DragDropContext>
//           </div>
//         </main>
//       </div>

//       {/* Task Modal */}
//       <TaskModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         initialData={selectedTask}
//       />
//       {/* <TaskDebug /> */}
//     </div>
//   );
// };

// export default App;

import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import TaskList from "./components/task/TaskList";
import TaskModal from "./components/task/TaskModal";
import TaskFilters from "./components/task/TaskFilters";
import Statistics from "./components/dashboard/Statistics";
import Timeline from "./components/dashboard/Timeline";
import useTaskStore from "./store/taskStore";
import { LayoutDashboard, Calendar } from "lucide-react";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState("board"); // 'board' or 'timeline'
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    updateTaskStatus(draggableId, destination.droppableId);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onCreateTask={handleCreateTask} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            {/* View Toggle */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {view === "board" ? "Task Board" : "Timeline View"}
              </h1>

              <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setView("board")}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md transition-colors
                    ${
                      view === "board"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <LayoutDashboard size={20} />
                  <span>Board</span>
                </button>

                <button
                  onClick={() => setView("timeline")}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md transition-colors
                    ${
                      view === "timeline"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <Calendar size={20} />
                  <span>Timeline</span>
                </button>
              </div>
            </div>

            {/* Statistics Dashboard */}
            <Statistics />

            {/* Filters */}
            <TaskFilters />

            {/* Task Board / Timeline */}
            {view === "board" ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <TaskList onEditTask={handleEditTask} />
              </DragDropContext>
            ) : (
              <Timeline />
            )}
          </div>
        </main>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedTask}
      />
    </div>
  );
};

export default App;
