// import React, { useMemo } from "react";
// import useTaskStore from "../../store/taskStore";

// const Timeline = () => {
//   const tasks = useTaskStore((state) => state.tasks);

//   const timelineData = useMemo(() => {
//     const today = new Date();
//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - today.getDay());

//     const dates = Array.from({ length: 14 }, (_, i) => {
//       const date = new Date(startOfWeek);
//       date.setDate(startOfWeek.getDate() + i);
//       return date;
//     });

//     return dates;
//   }, []);

//   const tasksByDate = useMemo(() => {
//     const taskMap = new Map();

//     Array.from(tasks.values()).forEach((task) => {
//       const startDate = new Date(task.startDate);
//       const dateKey = startDate.toISOString().split("T")[0];

//       if (!taskMap.has(dateKey)) {
//         taskMap.set(dateKey, []);
//       }
//       taskMap.get(dateKey).push(task);
//     });

//     return taskMap;
//   }, [tasks]);

//   return (
//     <div className="bg-white p-4 rounded-lg shadow">
//       <h2 className="text-lg font-semibold mb-4">Timeline View</h2>

//       <div className="overflow-x-auto">
//         <div className="inline-flex min-w-full">
//           {timelineData.map((date, index) => {
//             const dateKey = date.toISOString().split("T")[0];
//             const dayTasks = tasksByDate.get(dateKey) || [];

//             return (
//               <div key={dateKey} className="flex-1 min-w-[100px] border-l">
//                 <div className="px-2 py-1 text-sm text-gray-600">
//                   {date.toLocaleDateString("en-US", {
//                     weekday: "short",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </div>

//                 <div className="min-h-[200px] relative">
//                   {dayTasks.map((task, taskIndex) => (
//                     <div
//                       key={task.id}
//                       className="absolute w-full px-1"
//                       style={{ top: `${taskIndex * 40}px` }}
//                     >
//                       <div
//                         className={`
//                           p-2 text-xs rounded
//                           ${
//                             task.status === "In Progress"
//                               ? "bg-blue-100"
//                               : task.status === "Paused"
//                               ? "bg-yellow-100"
//                               : task.status === "Ready for Launch"
//                               ? "bg-green-100"
//                               : "bg-gray-100"
//                           }
//                         `}
//                       >
//                         {task.title}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Timeline;

import React, { useMemo } from "react";
import useTaskStore from "../../store/taskStore";
import { TASK_STATUS } from "../../constants/taskConstants";

const Timeline = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const tasksArray = useMemo(() => Object.values(tasks), [tasks]);

  // Generate dates for the next 14 days
  const timelineDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    return timelineDates.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const dayTasks = tasksArray.filter((task) => {
        const taskDate = task.startDate?.split("T")[0];
        return taskDate === dateStr;
      });
      return {
        date,
        tasks: dayTasks,
      };
    });
  }, [timelineDates, tasksArray]);

  const getStatusColor = (status) => {
    switch (status) {
      case TASK_STATUS.READY_FOR_LAUNCH:
        return "bg-green-100 text-green-800 border-green-200";
      case TASK_STATUS.IN_PROGRESS:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case TASK_STATUS.PAUSED:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Timeline View</h2>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full">
          {tasksByDate.map(({ date, tasks }) => (
            <div
              key={date.toISOString()}
              className="flex-none w-64 border-r border-gray-200"
            >
              <div className="sticky top-0 bg-gray-50 p-3 border-b text-sm font-medium">
                {date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>

              <div className="p-2 space-y-2">
                {tasks.length === 0 ? (
                  <div className="text-sm text-gray-500 py-2 text-center">
                    No tasks
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-2 rounded border ${getStatusColor(
                        task.status
                      )} text-sm`}
                    >
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-xs mt-1 line-clamp-2">
                          {task.description}
                        </div>
                      )}
                      <div className="mt-2 text-xs flex items-center justify-between">
                        <span>{task.status}</span>
                        {task.assignee?.length > 0 && (
                          <div className="flex -space-x-2">
                            {task.assignee.map((user, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs"
                              >
                                {user.charAt(0).toUpperCase()}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
