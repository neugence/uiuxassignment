import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useTaskStore from '../stores/taskStore';

// Sortable Task Component
const SortableTask = ({ id, task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { deleteTask, editTask, toggleTaskCompletion } = useTaskStore();

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="task">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTaskCompletion(task.id)}
      />
      <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.text}
      </span>
      <button onClick={() => editTask(task.id, { text: 'Updated Task' })}>
        Edit
      </button>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </div>
  );
};

// TaskList Component
const TaskList = () => {
  const {
    getFilteredAndSortedTasks,
    currentPage,
    tasksPerPage,
    reorderTasks,
  } = useTaskStore();

  // Get filtered and sorted tasks
  const filteredTasks = getFilteredAndSortedTasks();

  // Calculate the tasks to display for the current page
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag-and-drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = currentTasks.findIndex((task) => task.id === active.id);
      const newIndex = currentTasks.findIndex((task) => task.id === over.id);
      reorderTasks(oldIndex, newIndex);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={currentTasks} strategy={verticalListSortingStrategy}>
        <main className="task-list">
          {currentTasks.map((task) => (
            <SortableTask key={task.id} id={task.id} task={task} />
          ))}
        </main>
      </SortableContext>
    </DndContext>
  );
};

export default TaskList;