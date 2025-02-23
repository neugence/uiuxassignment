import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useTaskStore from '@/store/taskStore';

const DeleteTaskModal = ({ task, isOpen, onClose }) => {
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const handleDeleteTask = async () => {
    await deleteTask(task._id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <p>Are you sure you want to delete this task?</p>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTask}>Delete</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTaskModal;