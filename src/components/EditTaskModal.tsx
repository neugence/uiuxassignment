import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useTaskStore } from '../lib/store'
import { useState, useEffect } from 'react'
import { Task } from '../types/task'

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

const STATUSES = [
  { id: 'general-info', label: 'General Information' },
  { id: 'backlog', label: 'Backlog' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'paused', label: 'Paused' },
  { id: 'completed', label: 'Ready for Launch' },
]

export default function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const updateTask = useTaskStore((state) => state.updateTask)
  const [formData, setFormData] = useState({
    title: task.title,
    status: task.status,
    startDate: task.startDate || '',
    endDate: task.endDate || '',
  })

  useEffect(() => {
    setFormData({
      title: task.title,
      status: task.status,
      startDate: task.startDate || '',
      endDate: task.endDate || '',
    })
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateTask(task.id, {
      ...task,
      ...formData,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title">Title</label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-2">
            <label>Status</label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label>Start Date</label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <label>End Date</label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 