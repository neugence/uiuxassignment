import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Task } from "../types/task";
import { useSortable } from "@dnd-kit/sortable";
import { Eye, MessageSquare, Calendar, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { CSS } from '@dnd-kit/utilities';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";

interface SortableCardProps {
  task: Task;
  onEdit: () => void;
  isEditing: boolean;
  editProps?: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onSave: () => void;
    onCancel: () => void;
  };
  onOpenEditModal: () => void;
  onDelete: () => void;
}

function SortableCard({ task, onEdit, isEditing, editProps, onOpenEditModal, onDelete }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="shadow-sm">
        <CardHeader className="p-3 pb-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {task.tags && (
                <div className="flex gap-1 pb-2">
                  {task.tags.map((tag) => (
                    <div
                      key={tag}
                      className={`h-1.5 w-8 rounded-full ${
                        {
                          purple: "bg-purple-500",
                          blue: "bg-blue-500",
                          cyan: "bg-cyan-500",
                          green: "bg-green-500",
                          pink: "bg-pink-500",
                          red: "bg-red-500",
                        }[tag]
                      }`}
                    />
                  ))}
                </div>
              )}
              {isEditing && editProps ? (
                <div className="flex gap-2">
                  <Input
                    value={editProps.value}
                    onChange={editProps.onChange}
                    onKeyDown={editProps.onKeyDown}
                    autoFocus
                    className="text-sm font-medium"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={editProps.onSave}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={editProps.onCancel}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <h3
                  className="text-sm font-medium cursor-pointer hover:text-blue-600"
                  onClick={onEdit}
                >
                  {task.title}
                </h3>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 -mt-1 -mr-2"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onOpenEditModal}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {task.subtitle && <p className="text-xs text-gray-500">{task.subtitle}</p>}
          {(task.startDate || task.endDate) && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <Calendar className="h-4 w-4" />
              <span>
                {task.startDate && new Date(task.startDate).toLocaleDateString()} 
                {task.endDate && ` - ${new Date(task.endDate).toLocaleDateString()}`}
              </span>
            </div>
          )}
        </CardContent>
        {(task.views ||
          task.comments ||
          task.date ||
          task.status ||
          task.badge ||
          task.assignee ||
          task.assignees) && (
          <CardFooter className="flex items-center gap-4 p-3 pt-0">
            <div className="flex items-center gap-3 text-gray-500">
              {task.views && (
                <div className="flex items-center gap-1 text-xs">
                  <Eye className="h-4 w-4" />
                  {task.views}
                </div>
              )}
              {task.comments && (
                <div className="flex items-center gap-1 text-xs">
                  <MessageSquare className="h-4 w-4" />
                  {task.comments}
                </div>
              )}
              {task.date && (
                <div className="flex items-center gap-1 text-xs">
                  <Calendar className="h-4 w-4" />
                  {task.date}
                </div>
              )}
              {task.badge && <div className="text-xs">{task.badge}</div>}
              {task.status && <div className="text-xs">Status: {task.status}</div>}
            </div>
            {(task.assignee || task.assignees) && (
              <div className="ml-auto flex -space-x-2">
                {task.assignee && (
                  <Avatar className="h-6 w-6 border-2 border-white">
                    <AvatarImage src={task.assignee} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
                {task.assignees?.map((assignee, i) => (
                  <Avatar key={i} className="h-6 w-6 border-2 border-white">
                    <AvatarImage src={assignee} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default SortableCard