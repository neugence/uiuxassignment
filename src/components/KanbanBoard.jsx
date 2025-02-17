import { useState, useEffect } from "react"
import { useTaskStore } from "../store/taskStore"
import { Modal } from "./Modal"
import { AddTaskForm } from "./AddTaskForm"
// Make sure this line matches exactly
import { SearchAndFilter } from "./SearchAndFilter"
import {PlusCircle, UserCircle,Calendar,ChevronLeft,ChevronRight,ChevronsLeft,ChevronsRight,Sparkles} from "lucide-react"

// Add this priority order constant at the top of your file, after imports
const PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2
};

export const KanbanBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [animation, setAnimation] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [tasksPerPage, setTasksPerPage] = useState(10)
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
  } = useTaskStore()

  useEffect(() => {
    setAnimation(true)
    const timer = setTimeout(() => setAnimation(false), 500)
    return () => clearTimeout(timer)
  }, [tasks, currentPage])

  const columns = [
    { id: "general information", title: "General Information", color: "from-blue-500 to-cyan-400", icon: "📋" },
    { id: "in-progress", title: "In Progress", color: "from-amber-500 to-orange-400", icon: "⚡" },
    { id: "review", title: "Review", color: "from-purple-500 to-pink-400", icon: "👀" },
    { id: "backlog", title: "Backlog", color: "from-emerald-500 to-teal-400", icon: "📝" },
    { id: "done", title: "Done", color: "from-green-500 to-lime-400", icon: "✅" },
  ]

  // Filter and paginate tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const totalTasks = filteredTasks.length
  const totalPages = Math.ceil(totalTasks / tasksPerPage)
  const startIndex = (currentPage - 1) * tasksPerPage
  const endIndex = startIndex + tasksPerPage
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setAnimation(true)
  }

  const handleTasksPerPageChange = (e) => {
    const value = Number.parseInt(e.target.value)
    setTasksPerPage(value)
    setCurrentPage(1)
  }

  // Drag and drop handlers
  const handleDragStart = (e, taskId, columnId, index) => {
    setIsDragging(true);
    setDraggedItem({ taskId, columnId, index });
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("columnId", columnId);
    e.dataTransfer.setData("index", index.toString());
    e.target.classList.add("opacity-50", "scale-105", "rotate-2");
  }

  const handleDragEnd = (e) => {
    setIsDragging(false)
    e.target.classList.remove("opacity-50", "scale-105", "rotate-2")
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add("bg-gray-50")
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("bg-gray-50")
  }

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-gray-50");
    const taskId = e.dataTransfer.getData("taskId");
    
    if (draggedItem && dragOverItem && 
        draggedItem.columnId === columnId && 
        draggedItem.index !== dragOverItem.index) {
      
      const columnTasks = paginatedTasks
        .filter(task => task.status === columnId)
        .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
      
      const taskToMove = columnTasks[draggedItem.index];
      const updatedTasks = columnTasks.filter(task => task.id !== taskToMove.id);
      updatedTasks.splice(dragOverItem.index, 0, taskToMove);
      
      // Update positions
      updatedTasks.forEach((task, index) => {
        updateTask(task.id, { ...task, position: index });
      });
    } else {
      moveTask(taskId, columnId);
    }
    
    setAnimation(true);
    setDraggedItem(null);
    setDragOverItem(null);
    
    // Clean up visual indicators
    const taskElements = document.querySelectorAll('[data-position]');
    taskElements.forEach(task => {
      task.classList.remove('border-t-2', 'border-b-2', 'border-blue-500');
    });
  }

  const handleTaskDragOver = (e, columnId, index) => {
    e.preventDefault();
    if (!draggedItem) return;
  
    if (draggedItem.columnId === columnId && draggedItem.index !== index) {
      const taskElements = document.querySelectorAll(`[data-column="${columnId}"] [data-position]`);
      taskElements.forEach(task => {
        task.classList.remove('border-t-2', 'border-b-2', 'border-blue-500');
      });
  
      const currentElement = e.currentTarget;
      if (draggedItem.index < index) {
        currentElement.classList.add('border-b-2', 'border-blue-500');
      } else {
        currentElement.classList.add('border-t-2', 'border-blue-500');
      }
      setDragOverItem({ columnId, index });
    }
  }

  const getPriorityStyle = (priority) => {
    const styles = {
      high: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
      low: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
    }
    return styles[priority] || styles.low
  }

  // Pagination Controls Component
  const PaginationControls = () => (
    <div className="bg-white p-6 rounded-2xl shadow-md backdrop-blur-lg bg-opacity-90 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Tasks per page:</span>
          <select
            value={tasksPerPage}
            onChange={handleTasksPerPageChange}
            className="border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, totalTasks)} of {totalTasks} tasks
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                  ${currentPage === page ? "bg-indigo-500 text-white" : "hover:bg-gray-100 text-gray-600"}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-full mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-400" />
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  Task Manager
                </h1>
              </div>
              <p className="text-gray-400">Transform your workflow, one task at a time</p>
            </div>
            <button
              onClick={() => {
                setEditingTask(null)
                setIsModalOpen(true)
              }}
              className="group flex items-center gap-2 bg-purple-500/20 text-purple-300 px-6 sm:px-8 py-3 sm:py-4 
                rounded-xl hover:bg-purple-500/30 transition-all duration-300 border border-purple-500/50"
            >
              <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Create New Task
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-gray-700">
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterPriority={filterPriority}
            onFilterChange={setFilterPriority}
          />
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`bg-gray-800/50 rounded-2xl transition-all duration-300 border border-gray-700/50 backdrop-blur-xl flex flex-col
                ${isDragging ? "hover:ring-2 hover:ring-purple-500/50" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              data-column={column.id}
            >
              <div className={`p-4 rounded-t-2xl bg-gradient-to-r ${column.color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{column.icon}</span>
                    <h2 className="font-bold text-lg sm:text-xl capitalize text-white">{column.title}</h2>
                  </div>
                  <span className="px-3 py-1 bg-black/20 rounded-full text-sm text-white font-medium backdrop-blur-sm">
                    {paginatedTasks.filter((task) => task.status === column.id).length} tasks
                  </span>
                </div>
              </div>

              <div className="p-4 flex-grow overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {paginatedTasks
                  .filter((task) => task.status === column.id)
                  .sort((a, b) => {
                    // Sort by priority first
                    const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
                    if (priorityDiff !== 0) return priorityDiff;
                    
                    // If same priority, sort by date
                    if (a.endDate && b.endDate) {
                      return new Date(a.endDate) - new Date(b.endDate);
                    }
                    
                    // If no dates, maintain original order
                    return 0;
                  })
                  .map((task, index) => (
                    <div
                      key={task.id}
                      className={`group bg-gray-900/50 rounded-xl p-4 sm:p-5 hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50
                        ${animation ? "animate-fade-in" : ""}
                        hover:border-purple-500/50 cursor-grab active:cursor-grabbing`}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, task.id, column.id, index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleTaskDragOver(e, column.id, index)}
                      data-position={index}
                      data-task-id={task.id}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-medium text-gray-300 group-hover:text-gray-200 transition-colors break-words overflow-hidden">
                            {task.title}
                          </h3>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        <p className="text-gray-400 text-xs sm:text-sm break-words overflow-hidden">
                          {task.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-400 min-w-0 flex-1">
                            <div className="flex items-center gap-1 min-w-0">
                              <UserCircle className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                              <span className="truncate">{task.assignee || "Unassigned"}</span>
                            </div>
                            <div className="flex items-center gap-1 min-w-0">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                              <span className="truncate">{task.endDate || "No date"}</span>
                            </div>
                          </div>

                          <div className="flex gap-1 ml-2 shrink-0">
                            <button
                              onClick={() => {
                                setEditingTask(task)
                                setIsModalOpen(true)
                              }}
                              className="p-1 sm:p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Edit task"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 sm:p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete task"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-gray-400">
              <span className="text-sm">Tasks per page:</span>
              <select
                value={tasksPerPage}
                onChange={handleTasksPerPageChange}
                className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:ring-2 focus:ring-purple-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
              <span className="text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, totalTasks)} of {totalTasks} tasks
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                      ${currentPage === page ? "bg-purple-500 text-white" : "hover:bg-gray-700/50 text-gray-400"}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddTaskForm
          initialData={editingTask}
          onSubmit={(formData) => {
            if (editingTask) {
              updateTask(editingTask.id, formData)
            } else {
              addTask(formData)
            }
            setIsModalOpen(false)
          }}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default KanbanBoard

