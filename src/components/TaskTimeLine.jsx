import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { Tooltip } from "react-tooltip";
import { ArrowLeft } from "lucide-react"; // Using Lucide React for icons

const TaskScheduler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task || { subtasks: [] };

  const handleNavigate = () => navigate(-1);

  const events = task.subtasks.map((sub) => ({
    id: sub._id,
    title: sub.title,
    start: sub.startDate ? moment(sub.startDate).toDate() : null,
    end: sub.endDate ? moment(sub.endDate).toDate() : null,
    assigneesName: sub.assignees?.map((a) => a).join(", ") || "No assignees",
    assignees: sub.assignees?.length || 0,
    color:
      sub.status === "Completed"
        ? "#4CAF50"
        : sub.status === "In Progress"
        ? "#FFC107"
        : "#2196F3",
  }));

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded-2xl shadow-lg border dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white flex items-center">
          📅 Task Scheduler
        </h1>
        <button
          onClick={handleNavigate}
          className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Empty State */}
      {task.subtasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-lg text-center py-6">
          No tasks available
        </p>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Added timeGridPlugin for week & day views
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay", // Added week & day options
          }}
          events={events}
          eventContent={(eventInfo) => (
            <div
              className="p-2 rounded-lg text-white text-sm font-medium shadow-md transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: eventInfo.event.backgroundColor,
                borderLeft: "5px solid rgba(0, 0, 0, 0.2)",
                padding: "5px 10px",
              }}
              data-tooltip-id={`tooltip-${eventInfo.event.id}`}
            >
              {eventInfo.event.title}
              <Tooltip
                id={`tooltip-${eventInfo.event.id}`}
                place="top"
                content={`📌 Assignees: ${eventInfo.event.extendedProps.assigneesName}`}
              />
            </div>
          )}
          height="auto"
        />
      )}
    </div>
  );
};

export default TaskScheduler;
