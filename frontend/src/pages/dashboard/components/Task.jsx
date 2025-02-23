import React, { useRef, useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Calendar, Save, X } from 'lucide-react';
import CommentsModal from '@/pages/dashboard/components/CommentsModal';

const ItemType = 'TASK';

const Task = ({ task, index, moveTask, handleTitleEdit, handleSaveTitle, handleCancelEdit, editingTaskId, editedTitle, setEditedTitle, handleEditClick, handleDeleteClick }) => {
  const ref = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: () => ({
      id: task._id,
      index,
      status: task.status,
      order: task.order,
      sourceIndex: index
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.sourceIndex;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveTask(dragIndex, hoverIndex, task);
      item.index = hoverIndex;
    }
  });

  const dragDropRef = drag(drop(ref));

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dragDropRef} style={{ opacity: isDragging ? 0.5 : 1 }} className="bg-white cursor-move rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          {editingTaskId === task._id ? (
            <div className="flex items-center">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="border border-gray-300 rounded p-1"
              />
              <Button variant="ghost" size="icon" onClick={() => handleSaveTitle(task)}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <CardTitle className="text-sm font-medium cursor-pointer" onClick={() => handleTitleEdit(task)}>
                {task.title}
              </CardTitle>
              <div className="relative" ref={ref}>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg">
                    <Button variant="ghost" className="w-full text-left" onClick={() => handleEditClick(task)}>
                      Edit
                    </Button>
                    <Button variant="ghost" className="w-full text-left hover:text-red-400" onClick={() => handleDeleteClick(task)}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {task.assignees.length > 0 && (
          <div className="flex overflow-hidden">
            {task.assignees.map((assignee, index) => (
              <div key={index} className="border-2 bg-gray-200 p-1 rounded-md border-white text-xs">
                {assignee.name}
              </div>
            ))}
          </div>
        )}
        {task.startDate && (
          <Badge variant="secondary" className="mt-2 gap-0.5">
            <Calendar className="h-4 w-4 text-gray-500" />
            {new Date(task.startDate).toLocaleDateString()}
            {task.endDate && ` - ${new Date(task.endDate).toLocaleDateString()}`}
          </Badge>
        )}
        <div className="flex gap-2 mt-2">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Eye className="h-3 w-3" />
          </Button>
          <CommentsModal task={task} />
        </div>
      </CardContent>
    </div>
  );
};

export default Task;