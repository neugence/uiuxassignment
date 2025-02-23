import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Select from 'react-select';
import { Plus } from 'lucide-react';

const AddTaskDialog = ({ newTask, setNewTask, handleAddTask, columns, assigneeOptions, handleAssigneesChange, initialStatus }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setNewTask((prevTask) => ({ ...prevTask, status: initialStatus, assignees: prevTask.assignees || [] }));
  }, [initialStatus, setNewTask]);

  const handleStatusChange = (selectedOption) => {
    setNewTask({ ...newTask, status: selectedOption.value });
  };

  const handleAddTaskAndClose = async () => {
    await handleAddTask();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 bg-gray-100 shadow-none text-gray-400">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <Select
            value={{ value: newTask.status, label: newTask.status }}
            onChange={handleStatusChange}
            options={columns.map(status => ({ value: status, label: status }))}
          />
          <Select
            isMulti
            value={assigneeOptions.filter(option => (newTask.assignees || []).includes(option.value))}
            onChange={handleAssigneesChange}
            options={assigneeOptions}
            placeholder="Select assignees"
          />
          <Input
            type="date"
            placeholder="Start date"
            value={newTask.startDate}
            onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
          />
          <Input
            type="date"
            placeholder="End date"
            value={newTask.endDate}
            onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
          />
          <Button onClick={handleAddTaskAndClose}>Create Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;