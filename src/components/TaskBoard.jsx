import React, { useContext, useMemo } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import TaskColumn from './TaskColumn';
import useTaskStore from '../store/taskStore';
import { Plus } from 'lucide-react';
import { GlobalContext } from '../context/GlobalContext';

function TaskBoard() {
  const { columns, getTasksByColumn, moveTask, reorderTasks } = useTaskStore();
  const { openModal } = useContext(GlobalContext);
  const handleDragEnd = event => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeColumn = active.data.current.sortable.containerId;
    const overColumn = over.data.current.sortable.containerId;

    if (activeColumn !== overColumn) {
      moveTask(activeId, overColumn);
    } else {
      const tasks = getTasksByColumn(activeColumn);
      const oldIndex = tasks.findIndex(task => task.id === activeId);
      const newIndex = tasks.findIndex(task => task.id === overId);
      reorderTasks(activeColumn, oldIndex, newIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-2">
      <div className="max-w-[1800px] mx-auto">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {columns.map(column => (
              <div key={column} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-700">{column}</h2>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => openModal()}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <TaskColumn column={column} tasks={getTasksByColumn(column)} />
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}

export default TaskBoard;
