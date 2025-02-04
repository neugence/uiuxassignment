// import React, { useMemo } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import TaskCard from "./TaskCard";
// import useTaskStore from "../../store/taskStore";
// import { TASK_STATUS } from "../../constants/taskConstants";

// const TaskList = ({ onEditTask }) => {
//   const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);
//   const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
//   const filters = useTaskStore((state) => state.filters);

//   // Get filtered tasks and organize by status
//   const tasksByStatus = useMemo(() => {
//     const filteredTasks = getFilteredTasks();
//     return Object.values(TASK_STATUS).reduce((acc, status) => {
//       acc[status] = filteredTasks.filter((task) => task.status === status);
//       return acc;
//     }, {});
//   }, [getFilteredTasks, filters]); // Include filters in dependencies

//   const handleDragEnd = (result) => {
//     const { destination, source, draggableId } = result;

//     if (!destination) return;

//     if (
//       destination.droppableId === source.droppableId &&
//       destination.index === source.index
//     ) {
//       return;
//     }

//     updateTaskStatus(draggableId, destination.droppableId);
//   };

//   const DroppableColumn = ({ status }) => {
//     const columnTasks = tasksByStatus[status] || [];

//     return (
//       <Droppable droppableId={status}>
//         {(provided, snapshot) => (
//           <div
//             {...provided.droppableProps}
//             ref={provided.innerRef}
//             className={`space-y-4 min-h-[200px] p-4 rounded-lg ${
//               snapshot.isDraggingOver ? "bg-gray-100" : "bg-gray-50"
//             }`}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-medium text-gray-700">{status}</h3>
//               <span className="text-sm text-gray-500">
//                 {columnTasks.length}
//               </span>
//             </div>

//             {columnTasks.map((task, index) => (
//               <Draggable
//                 key={task.id}
//                 draggableId={String(task.id)}
//                 index={index}
//               >
//                 {(provided, snapshot) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     className={`mb-2 ${
//                       snapshot.isDragging ? "opacity-50" : ""
//                     }`}
//                   >
//                     <TaskCard task={task} onEdit={() => onEditTask(task)} />
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}

//             {columnTasks.length === 0 && (
//               <div className="text-center py-4 text-gray-500 text-sm">
//                 No tasks
//               </div>
//             )}
//           </div>
//         )}
//       </Droppable>
//     );
//   };

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         {Object.values(TASK_STATUS).map((status) => (
//           <div key={status} className="bg-white rounded-lg shadow">
//             <DroppableColumn status={status} />
//           </div>
//         ))}
//       </div>
//     </DragDropContext>
//   );
// };

// export default TaskList;

// import React, { useMemo } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import TaskCard from "./TaskCard";
// import useTaskStore from "../../store/taskStore";
// import { TASK_STATUS } from "../../constants/taskConstants";

// const TaskList = ({ onEditTask }) => {
//   const tasks = useTaskStore((state) => state.tasks);
//   const filters = useTaskStore((state) => state.filters);
//   const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

//   // Filter and group tasks by status
//   const filteredTasksByStatus = useMemo(() => {
//     const tasksArray = Object.values(tasks);

//     // Apply filters
//     const filteredTasks = tasksArray.filter((task) => {
//       const searchMatch =
//         !filters.search ||
//         task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
//         (task.description &&
//           task.description
//             .toLowerCase()
//             .includes(filters.search.toLowerCase()));

//       const statusMatch = !filters.status || task.status === filters.status;

//       const assigneeMatch =
//         !filters.assignee ||
//         (task.assignee && task.assignee.includes(filters.assignee));

//       return searchMatch && statusMatch && assigneeMatch;
//     });

//     // Group by status
//     return Object.values(TASK_STATUS).reduce((acc, status) => {
//       acc[status] = filteredTasks.filter((task) => task.status === status);
//       return acc;
//     }, {});
//   }, [tasks, filters]);

//   const handleDragEnd = (result) => {
//     const { destination, source, draggableId } = result;

//     if (!destination) return;

//     if (
//       destination.droppableId === source.droppableId &&
//       destination.index === source.index
//     ) {
//       return;
//     }

//     updateTaskStatus(draggableId, destination.droppableId);
//   };

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         {Object.values(TASK_STATUS).map((status) => (
//           <div key={status} className="bg-white rounded-lg shadow">
//             <Droppable droppableId={status}>
//               {(provided, snapshot) => (
//                 <div
//                   {...provided.droppableProps}
//                   ref={provided.innerRef}
//                   className={`space-y-4 min-h-[200px] p-4 rounded-lg ${
//                     snapshot.isDraggingOver ? "bg-gray-100" : "bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="font-medium text-gray-700">{status}</h3>
//                     <span className="text-sm text-gray-500">
//                       {filteredTasksByStatus[status]?.length || 0}
//                     </span>
//                   </div>

//                   {filteredTasksByStatus[status]?.map((task, index) => (
//                     <Draggable
//                       key={task.id}
//                       draggableId={String(task.id)}
//                       index={index}
//                     >
//                       {(provided, snapshot) => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           className={`mb-2 ${
//                             snapshot.isDragging ? "opacity-50" : ""
//                           }`}
//                         >
//                           <TaskCard
//                             task={task}
//                             onEdit={() => onEditTask(task)}
//                           />
//                         </div>
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}

//                   {(!filteredTasksByStatus[status] ||
//                     filteredTasksByStatus[status].length === 0) && (
//                     <div className="text-center py-4 text-gray-500 text-sm">
//                       No tasks
//                     </div>
//                   )}
//                 </div>
//               )}
//             </Droppable>
//           </div>
//         ))}
//       </div>
//     </DragDropContext>
//   );
// };

// export default TaskList;

import React, { useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import useTaskStore from "../../store/taskStore";
import { TASK_STATUS } from "../../constants/taskConstants";

const TaskList = ({ onEditTask }) => {
  const tasks = useTaskStore((state) => state.tasks);
  const filters = useTaskStore((state) => state.filters);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  // Filter and group tasks by status
  const filteredTasksByStatus = useMemo(() => {
    const tasksArray = Object.values(tasks);

    // Apply filters
    const filteredTasks = tasksArray.filter((task) => {
      const searchMatch =
        !filters.search ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (task.description &&
          task.description
            .toLowerCase()
            .includes(filters.search.toLowerCase()));

      const statusMatch = !filters.status || task.status === filters.status;

      const assigneeMatch =
        !filters.assignee ||
        (task.assignee && task.assignee.includes(filters.assignee));

      return searchMatch && statusMatch && assigneeMatch;
    });

    // Group by status
    return Object.values(TASK_STATUS).reduce((acc, status) => {
      acc[status] = filteredTasks.filter((task) => task.status === status);
      return acc;
    }, {});
  }, [tasks, filters]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    updateTaskStatus(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.values(TASK_STATUS).map((status) => (
          <div key={status} className="bg-white rounded-lg shadow">
            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-4 min-h-[200px] p-4 rounded-lg ${
                    snapshot.isDraggingOver ? "bg-gray-100" : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-700">{status}</h3>
                    <span className="text-sm text-gray-500">
                      {filteredTasksByStatus[status]?.length || 0}
                    </span>
                  </div>

                  {filteredTasksByStatus[status]?.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-2 ${
                            snapshot.isDragging ? "opacity-50" : ""
                          }`}
                        >
                          <TaskCard
                            task={task}
                            onEdit={() => onEditTask(task)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {(!filteredTasksByStatus[status] ||
                    filteredTasksByStatus[status].length === 0) && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No tasks
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskList;
