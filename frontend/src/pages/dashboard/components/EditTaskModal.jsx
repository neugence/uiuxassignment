import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Select from 'react-select';
import useTaskStore from '@/store/taskStore';

const EditTaskModal = ({ task, isOpen, onClose, columns, assigneeOptions, handleAssigneesChange }) => {
  const [updatedTask, setUpdatedTask] = useState(task);
  const updateTask = useTaskStore((state) => state.updateTask);

  useEffect(() => {
    setUpdatedTask(task);
  }, [task]);

  const handleUpdateTask = async () => {
    await updateTask(updatedTask);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Task title"
            value={updatedTask.title}
            onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
          />
          <Select
            value={columns.find(column => column === updatedTask.status)}
            onChange={(option) => setUpdatedTask({ ...updatedTask, status: option.value })}
            options={columns.map(status => ({ value: status, label: status }))}
          />
          <Select
            isMulti
            value={assigneeOptions.filter(option => updatedTask.assignees.includes(option.value))}
            onChange={handleAssigneesChange}
            options={assigneeOptions}
            placeholder="Select assignees"
          />
          <Input
            type="date"
            placeholder="Start date"
            value={updatedTask.startDate}
            onChange={(e) => setUpdatedTask({ ...updatedTask, startDate: e.target.value })}
          />
          <Input
            type="date"
            placeholder="End date"
            value={updatedTask.endDate}
            onChange={(e) => setUpdatedTask({ ...updatedTask, endDate: e.target.value })}
          />
          <Button onClick={handleUpdateTask}>Update Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;