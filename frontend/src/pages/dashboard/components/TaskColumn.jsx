import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Task from '@/pages/dashboard/components/Task';
import AddTaskDialog from '@/pages/dashboard/components/AddTaskDialog';
import EditTaskModal from '@/pages/dashboard/components/EditTaskModal';
import DeleteTaskModal from '@/pages/dashboard/components/DeleteTaskModal';
import useTaskStore from '@/store/taskStore';

const ItemType = 'TASK';

const TaskColumn = ({ column, tasks, newTask, setNewTask, handleAddTask, columns, assigneeOptions, handleAssigneesChange }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  const updateTask = useTaskStore((state) => state.updateTask);
  const reorderTask = useTaskStore((state) => state.reorderTask);

  // Helper for calculating a new order index
  const calculateOrder = (hoverIndex) => {
    const sorted = [...tasks].sort((a, b) => a.order - b.order);
    if (sorted.length === 0) {
      // No tasks yet in the column
      return 1000;
    }
    if (hoverIndex <= 0) {
      // Dropping at the top
      return Math.floor(sorted[0].order / 2);
    }
    if (hoverIndex >= sorted.length) {
      // Dropping at the bottom
      return sorted[sorted.length - 1].order + 1000;
    }
    // Dropping between two tasks
    const prevOrder = sorted[hoverIndex - 1].order;
    const nextOrder = sorted[hoverIndex].order;
    return Math.floor((prevOrder + nextOrder) / 2);
  };

  // Called from Task’s hover method
  const moveTask = (dragIndex, hoverIndex, draggedTask) => {
    // If within same column
    if (draggedTask.status === column) {
      // If no positional change, do nothing
      if (dragIndex === hoverIndex) return;
      // Compute new order for within-column move
      const newOrder = calculateOrder(hoverIndex);
      reorderTask(draggedTask._id, newOrder, column);
    }
  };

  // Called when dropping across columns
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item, monitor) => {
      // Only handle if changing columns
      if (item.status !== column) {
        // For cross-column, treat as dropping at bottom of list
        // Then adjust if you want to handle more precise middle insertion
        const sorted = [...tasks].sort((a, b) => a.order - b.order);
        let dropIndex = sorted.length; // default => bottom
        // Optional: read position from mouse, find insertion
        // (For a more advanced approach, you can measure the bounding
        //  boxes of tasks in this column to insert in the middle.)

        const newOrder = calculateOrder(dropIndex);
        reorderTask(item.id, newOrder, column);
      }
    },
  });

  // Example title editing logic
  const handleTitleEdit = (task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
  };

  const handleSaveTitle = async (task) => {
    await updateTask({ ...task, title: editedTitle });
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditedTitle('');
  };

  // Example modals
  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
    setDropdownOpen(null);
  };

  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  return (
    <div className="bg-gray-100 rounded-lg p-3 md:p-4" ref={drop} data-column={column}>
    <h2 className="font-semibold mb-3 md:mb-4 text-gray-700 text-sm md:text-base">{column}</h2>
    <div className="space-y-2 md:space-y-3">
        {[...tasks]
          .sort((a, b) => a.order - b.order)
          .map((task, index) => (
            <Task
              key={task._id}
              index={index}
              task={task}
              moveTask={moveTask}
              handleTitleEdit={handleTitleEdit}
              handleSaveTitle={handleSaveTitle}
              handleCancelEdit={handleCancelEdit}
              editingTaskId={editingTaskId}
              editedTitle={editedTitle}
              setEditedTitle={setEditedTitle}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
            />
          ))}
      </div>

      <AddTaskDialog
        newTask={newTask}
        setNewTask={setNewTask}
        handleAddTask={handleAddTask}
        columns={columns}
        assigneeOptions={assigneeOptions}
        handleAssigneesChange={handleAssigneesChange}
      />

      {selectedTask && (
        <>
          <EditTaskModal
            task={selectedTask}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            columns={columns}
            assigneeOptions={assigneeOptions}
            handleAssigneesChange={handleAssigneesChange}
          />
          <DeleteTaskModal
            task={selectedTask}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default TaskColumn;