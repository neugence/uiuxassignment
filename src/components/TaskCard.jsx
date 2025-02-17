import React, { useState } from 'react'

const PriorityBadge = ({ priority }) => {
  const colors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${colors[priority]}`}>
      {priority}
    </span>
  )
}

export const TaskCard = ({ task, onDelete, onEdit, draggableProps }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)

  const handleSave = () => {
    onEdit(task.id, { ...task, title: editedTitle })
    setIsEditing(false)
  }

  return (
    <div 
      {...draggableProps}
      className="bg-white p-4 rounded-lg shadow mb-2 cursor-move"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full border rounded p-1"
              onBlur={handleSave}
              autoFocus
            />
          ) : (
            <h3 
              className="font-medium mb-2 cursor-pointer"
              onDoubleClick={() => setIsEditing(true)}
            >
              {task.title}
            </h3>
          )}
          <div className="flex items-center gap-2 mt-2">
            <PriorityBadge priority={task.priority} />
            <div className="flex -space-x-2">
              {task.assignees?.map((assignee, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
              ))}
            </div>
          </div>
        </div>
        <button 
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  )
}