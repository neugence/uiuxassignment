import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';

const Modal = ({ isOpen, onClose, defaultStatus }) => {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [status, setStatus] = useState(defaultStatus);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { addTask } = useTasks();

  useEffect(() => {
    setStatus(defaultStatus);
  }, [defaultStatus]);

  const handleSubmit = () => {
    addTask({ id: Date.now(), title, assignee, status, startDate, endDate });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Add Card Modal</h2>
      <div>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      </div>
      <div>
        <label>Assignee</label>
        <input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Assignee" />
      </div>
      <div>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Backlog">Backlog</option>
          <option value="In Progress">In Progress</option>
          <option value="Paused">Paused</option>
        </select>
      </div>
      <div>
        <label>Start Date</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div>
        <label>End Date</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <button onClick={handleSubmit}>Add Task</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Modal;