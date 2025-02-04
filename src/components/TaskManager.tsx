// @ts-nocheck
import React from "react"
import { useState, useMemo } from "react"
import { Button } from "../components/ui/button"
import { MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { useTaskStore } from "../lib/store"
import AddCardModal from "./AddCardModal"
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableCard from "./SortableCard"
import EditTaskModal from './EditTaskModal'
import { Task } from "../types/task"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { ScrollArea } from "../components/ui/scroll-area"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination"
import AddColumnModal from "./AddColumnModal"


type SortOption = 'none' | 'dateOldest' | 'dateNewest' | 'alphabetical';

interface TaskManagerProps {
  searchTerm: string;
  filterType: string;
}

export default function TaskManager({ searchTerm, filterType }: TaskManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const tasks = useTaskStore((state) => state.tasks)
  const updateTaskTitle = useTaskStore((state) => state.updateTaskTitle)
  const [activeId, setActiveId] = useState<string | null>(null);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [columnSortOptions, setColumnSortOptions] = useState<Record<string, SortOption>>({});
  const columns = useTaskStore((state) => state.columns)
  const addColumn = useTaskStore((state) => state.addColumn)
  const [currentPage, setCurrentPage] = useState(1)
  const columnsPerPage = 3
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false)
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const deleteColumn = useTaskStore((state) => state.deleteColumn);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleTitleSubmit = (taskId: string) => {
    if (editingTitle.trim()) {
      updateTaskTitle(taskId, editingTitle.trim())
    }
    setEditingTaskId(null)
    setEditingTitle('')
  }

  const handleEditCancel = () => {
    setEditingTaskId(null)
    setEditingTitle('')
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
      if (!matchesSearch) return false

      switch (filterType) {
        case "no-date":
          return !task.startDate && !task.endDate
        case "has-comments":
          return task.comments && task.comments > 0
        case "has-assignee":
          return task.assignee || (task.assignees && task.assignees.length > 0)
        case "has-tags":
          return task.tags && task.tags.length > 0
        default:
          return true
      }
    })
  }, [tasks, searchTerm, filterType])

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(task => task.status === status)
  }

  const getSortedTasks = (tasks: Task[], sortOption: SortOption) => {
    if (sortOption === 'none') return tasks;

    return [...tasks].sort((a, b) => {
      switch (sortOption) {
        case 'dateOldest':
          return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
        case 'dateNewest':
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    const draggedTask = tasks.find(task => task.id === event.active.id);
    if (draggedTask) {
      setColumnSortOptions(prev => ({
        ...prev,
        [draggedTask.status]: 'none'
      }));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      reorderTasks(active.id as string, over.id as string);
    }
    
    setActiveId(null);
  };

  const totalPages = Math.ceil(columns.length / columnsPerPage)
  const startIndex = (currentPage - 1) * columnsPerPage
  const visibleColumns = columns.slice(startIndex, startIndex + columnsPerPage)

  const handleAddColumn = (title: string) => {
    const columnId = `column-${Date.now()}`
    addColumn({
      id: columnId,
      title: title
    })
  }

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (columnId === 'general-info') {
      alert("The General Information column cannot be deleted");
      return;
    }

    if (window.confirm('Are you sure you want to delete this column? All tasks in this column will also be deleted.')) {
      deleteColumn(columnId);
    }
  };

  return (
    <div className="container mx-auto py-4 relative min-h-screen pb-16">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => setIsAddColumnModalOpen(true)}
          className="bg-white/10 text-white hover:bg-white/20"
        >
          Add Column
        </Button>
      </div>
      
      <div className="mt-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-3 gap-4">
            {visibleColumns.map((column) => {
              let columnTasks = getTasksByStatus(column.id);
              columnTasks = getSortedTasks(columnTasks, columnSortOptions[column.id] || 'none');
              
              return (
                <div key={column.id} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-white">{column.title}</h2>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-blue-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setColumnSortOptions(prev => ({
                            ...prev,
                            [column.id]: 'dateOldest'
                          }))}
                        >
                          Date created (oldest first)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setColumnSortOptions(prev => ({
                            ...prev,
                            [column.id]: 'dateNewest'
                          }))}
                        >
                          Date created (newest first)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setColumnSortOptions(prev => ({
                            ...prev,
                            [column.id]: 'alphabetical'
                          }))}
                        >
                          Card name (alphabetically)
                        </DropdownMenuItem>
                        {column.id !== 'general-info' && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteColumn(column.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Column
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <ScrollArea className="h-[calc(100vh-250px)]">
                    <div className="flex flex-col gap-2 pr-4">
                      <SortableContext
                        items={columnTasks.map(task => task.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {columnTasks.map((task) => (
                          <SortableCard
                            key={task.id}
                            task={task}
                            isEditing={editingTaskId === task.id}
                            editProps={
                              editingTaskId === task.id
                                ? {
                                    value: editingTitle,
                                    onChange: (e) => setEditingTitle(e.target.value),
                                    onKeyDown: (e) => {
                                      if (e.key === 'Enter') {
                                        handleTitleSubmit(task.id);
                                      } else if (e.key === 'Escape') {
                                        handleEditCancel();
                                      }
                                    },
                                    onSave: () => handleTitleSubmit(task.id),
                                    onCancel: handleEditCancel,
                                  }
                                : undefined
                            }
                            onEdit={() => {
                              setEditingTaskId(task.id);
                              setEditingTitle(task.title);
                            }}
                            onOpenEditModal={() => {
                              setSelectedTask(task);
                              setIsEditModalOpen(true);
                            }}
                            onDelete={() => handleDeleteTask(task.id)}
                          />
                        ))}
                      </SortableContext>
                      
                      <Button
                        variant="ghost"
                        className="flex w-full items-center justify-between bg-white/10 text-white hover:bg-white/20"
                        onClick={() => {
                          setSelectedColumn(column.id);
                          setIsModalOpen(true);
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add a card
                        </span>
                        <span className="flex gap-2 text-xs">
                          <span>⌘</span>
                          <span>⏎</span>
                        </span>
                      </Button>
                    </div>
                  </ScrollArea>
                </div>
              );
            })}
          </div>
        </DndContext>
      </div>

      {totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border py-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="bg-white/10 text-white hover:bg-white/20"
                  isDisabled={currentPage === 1}
                />
              </PaginationItem>
              {Array.from({length: totalPages}).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="bg-white/10 text-white hover:bg-white/20"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="bg-white/10 text-white hover:bg-white/20"
                  isDisabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <AddColumnModal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        onAdd={handleAddColumn}
      />
      
      <AddCardModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        columnId={selectedColumn}
      />

      {selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
        />
      )}
    </div>
  )
}