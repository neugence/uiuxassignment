import React, { memo, useCallback, useState } from "react";
import { Pencil, Trash2, Download, Users } from "lucide-react";
import axios from "axios";

const SubtaskItem = memo(
  ({ sub, task, setSubtaskToDelete, setIsDeleteModalOpen, setTasks }) => {
    const [editingSubtaskId, setEditingSubtaskId] = useState(null);
    const [editedTitle, setEditedTitle] = useState(sub.title);
    const [editedNote, setEditedNote] = useState(sub.note || "");
    const [editedStartDate, setEditedStartDate] = useState(sub.startDate || "");
    const [editedEndDate, setEditedEndDate] = useState(sub.endDate || "");
    const [editedAssignees, setEditedAssignees] = useState(
      sub.assignees?.join(", ") || ""
    );
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const handleSaveSubtask = useCallback(async () => {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/tasks/${task._id}/subtasks/${
            sub._id
          }`,
          {
            title: editedTitle,
            note: editedNote,
            startDate: editedStartDate,
            endDate: editedEndDate,
            assignees: editedAssignees
              .split(",")
              .map((assignee) => assignee.trim()),
          }
        );

        setTasks((prevTasks) =>
          prevTasks.map((taskItem) =>
            taskItem._id === task._id
              ? {
                  ...taskItem,
                  subtasks: taskItem.subtasks.map((subtask) =>
                    subtask._id === sub._id
                      ? {
                          ...subtask,
                          title: editedTitle,
                          note: editedNote,
                          startDate: editedStartDate,
                          endDate: editedEndDate,
                          assignees: editedAssignees
                            .split(",")
                            .map((assignee) => assignee.trim()),
                        }
                      : subtask
                  ),
                }
              : taskItem
          )
        );

        setEditingSubtaskId(null);
      } catch (error) {
        console.error("Error updating subtask:", error);
      }
    }, [
      editedTitle,
      editedNote,
      editedStartDate,
      editedEndDate,
      editedAssignees,
      task._id,
      sub._id,
      setTasks,
    ]);

    const downloadSubtask = (sub) => {
      const subtaskData = {
        title: sub.title,
        note: sub.note || "",
        startDate: sub.startDate || "Not specified",
        endDate: sub.endDate || "Not specified",
        assignees: sub.assignees?.join(", ") || "None",
      };

      const jsonString = JSON.stringify(subtaskData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${sub.title.replace(/\s+/g, "_")}_subtask.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-sm transition-colors w-full max-w-lg mx-auto">
        <div className="flex flex-wrap justify-between items-center">
          {editingSubtaskId === sub._id ? (
            <input
              type="text"
              className="w-full px-2 py-1 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          ) : (
            <span className="font-medium text-gray-800 dark:text-gray-200 truncate w-3/4">
              {sub.title}
            </span>
          )}

          <div className="flex space-x-2 mt-2 md:mt-0">
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-blue-500"
              onClick={() => {
                if (editingSubtaskId === sub._id) {
                  handleSaveSubtask();
                } else {
                  setEditingSubtaskId(sub._id);
                  setEditedTitle(sub.title);
                  setEditedNote(sub.note || "");
                  setEditedStartDate(sub.startDate || "");
                  setEditedEndDate(sub.endDate || "");
                  setEditedAssignees(sub.assignees?.join(", ") || "");
                }
              }}
              aria-label="Edit Subtask"
            >
              <Pencil className="w-5 h-5" />
            </button>

            <button
              className="text-gray-500 dark:text-red-400 hover:text-red-500"
              onClick={() => {
                setSubtaskToDelete({ taskId: task._id, subtaskId: sub._id });
                setIsDeleteModalOpen(true);
              }}
              aria-label="Delete Subtask"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <button
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700"
              onClick={() => downloadSubtask(sub)}
              aria-label="Download Subtask"
            >
              <Download className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-1">
              <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {sub.assignees?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {editingSubtaskId === sub._id ? (
          <>
            <input
              type="date"
              className="w-full px-2 py-1 mb-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedStartDate}
              onChange={(e) => setEditedStartDate(e.target.value)}
            />
            <input
              type="date"
              className="w-full px-2 py-1 mb-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedEndDate}
              onChange={(e) => setEditedEndDate(e.target.value)}
            />
            <textarea
              className="w-full px-2 py-1 mb-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedNote}
              onChange={(e) => setEditedNote(e.target.value)}
              placeholder="Add a note..."
            />
            <input
              type="text"
              className="w-full px-2 py-1 mb-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedAssignees}
              onChange={(e) => setEditedAssignees(e.target.value)}
              placeholder="Assignees (comma-separated)"
            />
            <button
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={handleSaveSubtask}
            >
              Save
            </button>
          </>
        ) : (
          <>
            {sub.startDate && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                📅 Start: {formatDate(sub.startDate)}
              </p>
            )}
            {sub.endDate && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ⏳ End: {formatDate(sub.endDate)}
              </p>
            )}
            {sub.note && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                📝 {sub.note}
              </p>
            )}
            {sub.assignees?.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                👥 Assignees: {sub.assignees.join(", ")}
              </p>
            )}
          </>
        )}
      </div>
    );
  }
);

export default SubtaskItem;
