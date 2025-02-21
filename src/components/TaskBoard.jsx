import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import SubtaskModal from "./SubtaskModal";
import DeleteModal from "./DeleteModal";
import TaskCard from "./TaskCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function TaskBoard({ initialTasks = [] }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubtasks = useCallback(async (taskId) => {
    if (!taskId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/subtasks`
      );
      const fetchedSubtasks = response.data || [];
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, subtasks: fetchedSubtasks } : task
        )
      );
    } catch (error) {
      console.error("Error fetching subtasks:", error);
      toast.error("Failed to fetch subtasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddSubtask = async (taskId, newSubtask) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/subtasks`,
        newSubtask
      );

      await fetchSubtasks(taskId);
      toast.success("Subtask added successfully!");
    } catch (error) {
      console.error("Error adding subtask:", error);
      toast.error("Failed to add subtask. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const confirmDeleteSubtask = useCallback(async () => {
    if (!subtaskToDelete) return;
    const { taskId, subtaskId } = subtaskToDelete;

    setIsLoading(true);
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/tasks/${taskId}/subtasks/${subtaskId}`
      );

      await fetchSubtasks(taskId);
      toast.success("Subtask deleted successfully!");
    } catch (error) {
      console.error("Error deleting subtask:", error);
      toast.error("Failed to delete subtask. Please try again.");
    } finally {
      setIsDeleteModalOpen(false);
      setSubtaskToDelete(null);
      setIsLoading(false);
    }
  }, [subtaskToDelete, fetchSubtasks]);

  const filteredTasks = useMemo(() => {
    return tasks.map((task) => ({
      ...task,
      subtasks: (Array.isArray(task.subtasks) ? task.subtasks : []).filter(
        (sub) => sub.title?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }));
  }, [tasks, searchQuery]);

  useEffect(() => {
    setTasks(initialTasks);
    initialTasks.forEach((task) => {
      if (!task.subtasks) fetchSubtasks(task._id);
    });
  }, [initialTasks, fetchSubtasks]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-6 transition-colors">
      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search subtasks..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task, index) => (
          <TaskCard
            key={index}
            task={task}
            setTasks={setTasks}
            setSelectedTask={setSelectedTask}
            setIsSubtaskModalOpen={setIsSubtaskModalOpen}
            navigate={navigate}
            setSubtaskToDelete={setSubtaskToDelete}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
          />
        ))}
      </div>

      {isSubtaskModalOpen && selectedTask && (
        <SubtaskModal
          task={selectedTask}
          onClose={() => setIsSubtaskModalOpen(false)}
          onSave={handleAddSubtask}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeleteSubtask}
        />
      )}

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
