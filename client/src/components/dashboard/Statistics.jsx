// import React, { useMemo } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from "recharts";
// import { TrendingUp, Users, Clock, CheckCircle } from "lucide-react";
// import useTaskStore from "../../store/taskStore";

// const Statistics = () => {
//   const tasks = useTaskStore((state) => state.tasks);
//   const taskArray = Array.from(tasks);

//   const stats = useMemo(() => {
//     const totalTasks = taskArray.length;
//     const completed = taskArray.filter(
//       (task) => task.status === "Ready for Launch"
//     ).length;
//     const inProgress = taskArray.filter(
//       (task) => task.status === "In Progress"
//     ).length;
//     const overdue = taskArray.filter((task) => {
//       if (task.status !== "Ready for Launch" && task.endDate) {
//         return new Date(task.endDate) < new Date();
//       }
//       return false;
//     }).length;

//     return {
//       totalTasks,
//       completed,
//       inProgress,
//       overdue,
//       completionRate: totalTasks
//         ? Math.round((completed / totalTasks) * 100)
//         : 0,
//     };
//   }, [taskArray]);

//   const tasksByStatus = useMemo(() => {
//     return ["Backlog", "In Progress", "Paused", "Ready for Launch"].map(
//       (status) => ({
//         status,
//         count: taskArray.filter((task) => task.status === status).length,
//       })
//     );
//   }, [taskArray]);

//   const taskTrend = useMemo(() => {
//     const last7Days = Array.from({ length: 7 }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       return date.toISOString().split("T")[0];
//     }).reverse();

//     return last7Days.map((date) => ({
//       date,
//       completed: taskArray.filter(
//         (task) =>
//           task.status === "Ready for Launch" &&
//           task.completedAt?.split("T")[0] === date
//       ).length,
//       created: taskArray.filter((task) => task.createdAt.split("T")[0] === date)
//         .length,
//     }));
//   }, [taskArray]);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//       {/* Key Metrics */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-100 rounded-full">
//             <TrendingUp className="text-blue-600" size={24} />
//           </div>
//           <div>
//             <h3 className="text-sm font-medium text-gray-500">
//               Completion Rate
//             </h3>
//             <p className="text-2xl font-semibold text-gray-900">
//               {stats.completionRate}%
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-green-100 rounded-full">
//             <CheckCircle className="text-green-600" size={24} />
//           </div>
//           <div>
//             <h3 className="text-sm font-medium text-gray-500">
//               Completed Tasks
//             </h3>
//             <p className="text-2xl font-semibold text-gray-900">
//               {stats.completed}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-yellow-100 rounded-full">
//             <Clock className="text-yellow-600" size={24} />
//           </div>
//           <div>
//             <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
//             <p className="text-2xl font-semibold text-gray-900">
//               {stats.inProgress}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-red-100 rounded-full">
//             <Users className="text-red-600" size={24} />
//           </div>
//           <div>
//             <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
//             <p className="text-2xl font-semibold text-gray-900">
//               {stats.overdue}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="col-span-full lg:col-span-2 bg-white p-6 rounded-lg shadow">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">
//           Task Completion Trend
//         </h3>
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={taskTrend}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="completed" stroke="#3B82F6" />
//               <Line type="monotone" dataKey="created" stroke="#10B981" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="col-span-full lg:col-span-2 bg-white p-6 rounded-lg shadow">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">
//           Tasks by Status
//         </h3>
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={tasksByStatus}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="status" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="count" fill="#3B82F6" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Statistics;

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, Users, Clock, CheckCircle } from "lucide-react";
import useTaskStore from "../../store/taskStore";
import { TASK_STATUS } from "../../constants/taskConstants";

const Statistics = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const tasksArray = useMemo(() => Object.values(tasks), [tasks]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTasks = tasksArray.length;
    const completed = tasksArray.filter(
      (task) => task.status === TASK_STATUS.READY_FOR_LAUNCH
    ).length;
    const inProgress = tasksArray.filter(
      (task) => task.status === TASK_STATUS.IN_PROGRESS
    ).length;
    const overdue = tasksArray.filter((task) => {
      if (task.status !== TASK_STATUS.READY_FOR_LAUNCH && task.endDate) {
        return new Date(task.endDate) < new Date();
      }
      return false;
    }).length;

    return {
      totalTasks,
      completed,
      inProgress,
      overdue,
      completionRate: totalTasks
        ? Math.round((completed / totalTasks) * 100)
        : 0,
    };
  }, [tasksArray]);

  // Calculate tasks by status for bar chart
  const tasksByStatus = useMemo(() => {
    return Object.values(TASK_STATUS).map((status) => ({
      status,
      count: tasksArray.filter((task) => task.status === status).length,
    }));
  }, [tasksArray]);

  // Calculate completion trend for line chart
  const taskTrend = useMemo(() => {
    // Get last 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    return dates.map((date) => {
      const dayTasks = tasksArray.filter((task) => {
        const taskDate = new Date(task.createdAt).toISOString().split("T")[0];
        return taskDate === date;
      });

      const completedTasks = tasksArray.filter((task) => {
        const taskDate = new Date(task.updatedAt).toISOString().split("T")[0];
        return (
          taskDate === date && task.status === TASK_STATUS.READY_FOR_LAUNCH
        );
      });

      return {
        date,
        total: dayTasks.length,
        completed: completedTasks.length,
      };
    });
  }, [tasksArray]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Key Metrics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <TrendingUp className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Completion Rate
            </h3>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.completionRate}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Completed Tasks
            </h3>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.completed}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-full">
            <Clock className="text-yellow-600" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.inProgress}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Users className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.overdue}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="col-span-full lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Task Completion Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={taskTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis />
              <Tooltip
                labelFormatter={formatDate}
                formatter={(value) => [value, "Tasks"]}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3B82F6"
                name="Total Tasks"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10B981"
                name="Completed Tasks"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-full lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Tasks by Status
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tasksByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" name="Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
