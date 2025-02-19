import React, { useState } from "react";
import Header from "./components/Header";
import TaskCard from "./components/TaskCard";
import Modal from "./components/Modal";
import useTaskStore from "./store/taskStore";
import Footer from "./components/Footer";

const App = () => {
  const { tasks, addTask, deleteTask, toggleTask, editTask } = useTaskStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const tasksPerPage = 4; // Number of tasks per page
  const [currentPage, setCurrentPage] = useState({});

  const handleAddTask = (newTask) => {
    addTask(newTask);
    setModalOpen(false);
  };

  const handleEditTask = (id, updatedTask) => {
    editTask(id, updatedTask);
    setModalOpen(false);
  };

  const groupedTasks = tasks.reduce((groups, task) => {
    const groupName = task.status || "Unspecified";
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(task);
    return groups;
  }, {});

  return (
    <>
      <div className="min-h-screen bg-base-200 p-4 bg-[url('https://images.pexels.com/photos/9941495/pexels-photo-9941495.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center">
        <Header />
        <div className="container mx-auto mt-6">
          <div className="flex justify-center mb-4">
            <button
              className="btn btn-primary w-48"
              onClick={() => {
                setCurrentTask(null);
                setModalOpen(true);
              }}
            >
              Add Task
            </button>
          </div>

          {Object.keys(groupedTasks).length > 0 ? (
            Object.entries(groupedTasks).map(([groupName, groupTasks]) => {
              const totalPages = Math.ceil(groupTasks.length / tasksPerPage);
              const currentPageNum = currentPage[groupName] || 1;
              const startIndex = (currentPageNum - 1) * tasksPerPage;
              const visibleTasks = groupTasks.slice(startIndex, startIndex + tasksPerPage);

              return (
                <div key={groupName} className="mb-8 capitalize px-5">
                  <h2 className="text-2xl font-bold mb-4">{groupName}</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {visibleTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onEdit={() => {
                          setCurrentTask(task);
                          setModalOpen(true);
                        }}
                        onDelete={deleteTask}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="join flex justify-center mt-4">
                      <button
                        className="join-item btn glass"
                        disabled={currentPageNum === 1}
                        onClick={() =>
                          setCurrentPage((prev) => ({
                            ...prev,
                            [groupName]: Math.max(1, currentPageNum - 1),
                          }))
                        }
                      >
                        «
                      </button>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          className={`join-item btn ${
                            currentPageNum === index + 1 ? "btn-accent" : "glass"
                          }`}
                          onClick={() =>
                            setCurrentPage((prev) => ({
                              ...prev,
                              [groupName]: index + 1,
                            }))
                          }
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        className="join-item btn glass"
                        disabled={currentPageNum === totalPages}
                        onClick={() =>
                          setCurrentPage((prev) => ({
                            ...prev,
                            [groupName]: Math.min(totalPages, currentPageNum + 1),
                          }))
                        }
                      >
                        »
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center text-center min-h-[70vh]">
              <svg
                className="w-32 h-32 text-slate-700 mb-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 0 0-1 1H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2a1 1 0 0 0-1-1H9Zm1 2h4v2h1a1 1 0 1 1 0 2H9a1 1 0 0 1 0-2h1V4Zm5.707 8.707a1 1 0 0 0-1.414-1.414L11 14.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-lg font-semibold">Oops.. Nothing Here, Add Notes!</p>
            </div>
          )}
        </div>

        {isModalOpen && (
          <Modal
            task={currentTask}
            onClose={() => setModalOpen(false)}
            onSave={(taskData) =>
              currentTask
                ? handleEditTask(currentTask.id, taskData)
                : handleAddTask(taskData)
            }
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default App;
