import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import { useTaskStore } from '../lib/store'

interface AddCardModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  columnId: string;
}

const COLUMN_NAMES = {
  'backlog': 'Backlog',
  'in-progress': 'In Progress',
  'paused': 'Paused',
  'completed': 'Ready for Launch',
  'general-info': 'General Information'
}

const AddCardModal: React.FC<AddCardModalProps> = ({isModalOpen, setIsModalOpen, columnId}) => {
  const addTask = useTaskStore((state) => state.addTask)
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newTask = {
      id: Date.now().toString(), // Simple way to generate unique id
      title: formData.title,
      status: columnId,
      date: formData.startDate, // You can format this better if needed
      assignee: '/placeholder.svg?height=32&width=32', // Default assignee
    }

    addTask(newTask)
    setFormData({ title: '', startDate: '', endDate: '' }) // Reset form
    setIsModalOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title">Title</label>
            <Input 
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <label>Assignee</label>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
              </div>
              <Button size="icon" variant="outline" type="button">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <label>Status</label>
            <div className="p-2 bg-gray-100 rounded-md text-sm">
              {COLUMN_NAMES[columnId as keyof typeof COLUMN_NAMES]}
            </div>
          </div>
          <div className="grid gap-2">
            <label>Start Date</label>
            <Input 
              type="date" 
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <label>End Date</label>
            <Input 
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddCardModal