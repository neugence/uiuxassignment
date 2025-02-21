import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "./SideBar";
import { Header } from "./Header";
import { TaskBoard } from "./TaskBoard";
import { ClipLoader } from "react-spinners";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/tasks`
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return activeSection === "All"
      ? tasks
      : tasks.filter((task) => task.type === activeSection);
  }, [tasks, activeSection]);

  const handleSectionSelect = useCallback((section) => {
    setActiveSection(section);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-800 transition-colors">
      <div className="flex flex-1">
        <SidebarProvider>
          <AppSidebar onSectionSelect={handleSectionSelect} />
          <main className="flex-1 p-4">
            <SidebarTrigger />
            <Header isOpen={isOpen} setIsOpen={setIsOpen} />

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <ClipLoader size={50} color="#2563eb" />
              </div>
            ) : (
              <TaskBoard initialTasks={filteredTasks} />
            )}
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}
