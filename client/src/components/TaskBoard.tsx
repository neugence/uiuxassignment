import React, { useMemo, useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskStatus } from '../types/task';
import useTaskStore from '../store/useTaskStore';
import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

const COLUMNS: TaskStatus[] = ['backlog', 'in-progress', 'paused', 'completed'];

export default function TaskBoard() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks, addTask, moveTask, reorderTasks } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksByStatus = useMemo(() => {
    const grouped = new Map<TaskStatus, Array<any>>();
    COLUMNS.forEach(status => grouped.set(status, []));
    
    Array.from(tasks.values()).forEach(task => {
      const statusTasks = grouped.get(task.status) || [];
      statusTasks.push(task);
      grouped.set(task.status, statusTasks);
    });
    
    return grouped;
  }, [tasks]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeTask = tasks.get(active.id as string);
      const overId = over.id as string;
      
      if (activeTask) {
        if (overId.includes('column')) {
          const newStatus = overId.replace('-column', '') as TaskStatus;
          moveTask(activeTask.id, newStatus);
        } else {
          const overTask = tasks.get(overId);
          if (overTask && activeTask.status === overTask.status) {
            const statusTasks = tasksByStatus.get(activeTask.status) || [];
            const oldIndex = statusTasks.findIndex(t => t.id === active.id);
            const newIndex = statusTasks.findIndex(t => t.id === over.id);
            reorderTasks(activeTask.status, oldIndex, newIndex);
          }
        }
      }
    }
    
    setActiveId(null);
  }, [tasks, moveTask, reorderTasks, tasksByStatus]);

  const activeTask = activeId ? tasks.get(activeId) : null;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="grid grid-cols-5 gap-4">
        {COLUMNS.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasksByStatus.get(status) || []}
            onAddCard={() => setIsModalOpen(true)}
          />
        ))}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addTask}
      />
    </div>
  );
}