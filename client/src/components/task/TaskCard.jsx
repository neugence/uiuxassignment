// import React, { useState } from "react";
// import { Draggable } from "react-beautiful-dnd";
// import { Calendar, Users, MessageSquare } from "lucide-react";
// import useTaskStore from "../../store/taskStore";

// const TaskCard = ({ task, index }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedTitle, setEditedTitle] = useState(task.title);
//   const updateTask = useTaskStore((state) => state.updateTask);

//   const handleTitleEdit = (e) => {
//     if (e.key === "Enter") {
//       updateTask(task.id, { title: editedTitle });
//       setIsEditing(false);
//     } else if (e.key === "Escape") {
//       setEditedTitle(task.title);
//       setIsEditing(false);
//     }
//   };

//   return (
//     <Draggable draggableId={task.id} index={index}>
//       {(provided) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
//         >
//           {isEditing ? (
//             <input
//               type="text"
//               value={editedTitle}
//               onChange={(e) => setEditedTitle(e.target.value)}
//               onKeyDown={handleTitleEdit}
//               onBlur={() => {
//                 setEditedTitle(task.title);
//                 setIsEditing(false);
//               }}
//               className="w-full p-1 border rounded"
//               autoFocus
//             />
//           ) : (
//             <h4
//               onClick={() => setIsEditing(true)}
//               className="font-medium text-gray-800 mb-2 cursor-pointer"
//             >
//               {task.title}
//             </h4>
//           )}

//           <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
//             <div className="flex items-center gap-1">
//               <Calendar size={16} />
//               <span>{new Date(task.startDate).toLocaleDateString()}</span>
//             </div>

//             <div className="flex items-center gap-1">
//               <Users size={16} />
//               <span>{task.assignee.length}</span>
//             </div>

//             <div className="flex items-center gap-1">
//               <MessageSquare size={16} />
//               <span>{task.comments?.length || 0}</span>
//             </div>
//           </div>

//           <div className="flex mt-3 -space-x-2">
//             {task.assignee.map((user, i) => (
//               <img
//                 key={i}
//                 src={`/api/placeholder/32/32`}
//                 alt={user}
//                 className="w-8 h-8 rounded-full border-2 border-white"
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </Draggable>
//   );
// };

// export default TaskCard;

import React from "react";
import { Calendar, Users, MessageSquare } from "lucide-react";

const TaskCard = ({ task, onEdit }) => {
  return (
    <div
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onEdit}
    >
      <h4 className="font-medium text-gray-800 mb-2">{task.title}</h4>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500">
        {task.startDate && (
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{new Date(task.startDate).toLocaleDateString()}</span>
          </div>
        )}

        {task.assignee?.length > 0 && (
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{task.assignee.length}</span>
          </div>
        )}

        {task.comments?.length > 0 && (
          <div className="flex items-center gap-1">
            <MessageSquare size={16} />
            <span>{task.comments.length}</span>
          </div>
        )}
      </div>

      {task.assignee?.length > 0 && (
        <div className="flex mt-3 -space-x-2">
          {task.assignee.map((user, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
            >
              {user.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
