import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ArrowUpDown, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTaskStore from '@/store/taskStore';
import TaskColumn from '@/pages/dashboard/components/TaskColumn';

const DashboardPage = () => {
  const { tasks, users, fetchTasks, fetchUsers, addTask } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [newTask, setNewTask] = useState({
    title: "",
    status: "Backlog",
    assignees: [],
    startDate: "",
    endDate: "",
  });
  const getColumnsPerPage = useCallback(() => {
    if (window.innerWidth < 640) return 1; // mobile
    if (window.innerWidth < 768) return 2; // tablet
    if (window.innerWidth < 1024) return 3; // small laptop
    if (window.innerWidth < 1280) return 4; // laptop
    return 5; // desktop
  }, []);
  const [currentPage, setCurrentPage] = useState(0);
  const [columnsPerPage, setColumnsPerPage] = useState(getColumnsPerPage());

  const columns = [
    "General Information",
    "Backlog",
    "In progress",
    "Paused",
    "Ready for launch"
  ];


  const totalPages = Math.ceil(columns.length / columnsPerPage);

  useEffect(() => {
    const handleResize = () => {
      setColumnsPerPage(getColumnsPerPage());
      // Reset to first page if current page would be out of bounds
      setCurrentPage(prev => Math.min(prev, Math.ceil(columns.length / getColumnsPerPage()) - 1));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getColumnsPerPage]);

  const getCurrentColumns = () => {
    const startIndex = currentPage * columnsPerPage;
    const endIndex = startIndex + columnsPerPage;
    return columns.slice(startIndex, endIndex);
  };

  // Navigation handlers
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };


  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [fetchTasks, fetchUsers]);

  const handleAddTask = async () => {
    if (newTask.title.trim() === "") return;
    await addTask(newTask);
    setNewTask({
      title: "",
      status: "Backlog",
      assignees: [],
      startDate: "",
      endDate: "",
    });
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || task.status === filterStatus;
      const matchesAssignee = filterAssignee === "all" || 
        task.assignees.some(assignee => assignee._id === filterAssignee);
      return matchesSearch && matchesStatus && matchesAssignee;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "titleDesc":
          return b.title.localeCompare(a.title);
        case "date":
          return new Date(a.startDate) - new Date(b.startDate);
        case "dateDesc":
          return new Date(b.startDate) - new Date(a.startDate);
        default:
          return 0;
      }
    });

  const handleAssigneesChange = (selectedOptions) => {
    setNewTask({ ...newTask, assignees: selectedOptions.map(option => option.value) });
  };

  const assigneeOptions = users.map(user => ({
    value: user._id,
    label: user.name,
  }));

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-gray-50 min-h-screen">
      {/* Header Section - Added blue accents */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        <h1 className="text-2xl font-bold text-blue-900">Dashboard</h1>
        <div className="flex flex-wrap gap-2 md:gap-4 items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-500" />
            <Input
              placeholder="Search tasks..."
              className="pl-8 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter and Sort Controls - Added blue accents */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[140px] border-blue-200 hover:border-blue-400">
                <Filter className="h-4 w-4 mr-2 text-blue-500" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {columns.map(status => (
                  <SelectItem 
                    key={status} 
                    value={status}
                    className="hover:bg-blue-50"
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger className="w-full md:w-[140px] border-blue-200 hover:border-blue-400">
                <User className="h-4 w-4 mr-2 text-blue-500" />
                <SelectValue placeholder="Filter Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {users.map(user => (
                  <SelectItem 
                    key={user._id} 
                    value={user._id}
                    className="hover:bg-blue-50"
                  >
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[140px] border-blue-200 hover:border-blue-400">
                <ArrowUpDown className="h-4 w-4 mr-2 text-blue-500" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="hover:bg-blue-50">No Sorting</SelectItem>
                <SelectItem value="title" className="hover:bg-blue-50">Title (A-Z)</SelectItem>
                <SelectItem value="titleDesc" className="hover:bg-blue-50">Title (Z-A)</SelectItem>
                <SelectItem value="date" className="hover:bg-blue-50">Date (Asc)</SelectItem>
                <SelectItem value="dateDesc" className="hover:bg-blue-50">Date (Desc)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Columns Section with Pagination - Added blue accents */}
      <div className="relative">
        {/* Pagination Navigation - Added blue accents */}
        <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-sm border border-blue-100">
          <Button
            variant="outline"
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="p-2 border-blue-200 hover:bg-blue-50 hover:border-blue-400 disabled:border-gray-200"
          >
            <ChevronLeft className="h-4 w-4 text-blue-600" />
          </Button>
          <span className="text-sm text-blue-900 font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className="p-2 border-blue-200 hover:bg-blue-50 hover:border-blue-400 disabled:border-gray-200"
          >
            <ChevronRight className="h-4 w-4 text-blue-600" />
          </Button>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {(window.innerWidth >= 768 ? columns : getCurrentColumns()).map((column) => (
            <TaskColumn
              key={column}
              column={column}
              tasks={filteredAndSortedTasks.filter((task) => task.status === column)}
              newTask={newTask}
              setNewTask={setNewTask}
              handleAddTask={handleAddTask}
              columns={columns}
              assigneeOptions={assigneeOptions}
              handleAssigneesChange={handleAssigneesChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;