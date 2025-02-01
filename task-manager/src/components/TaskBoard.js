import React, { useState } from 'react';
import TaskCard from './TaskCard';
import Modal from './Modal';
import { useTasks } from '../hooks/useTasks';

const TaskBoard = () => {
  const { tasks } = useTasks();
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');

  const openModal = (status) => {
    setCurrentStatus(status);
    setModalOpen(true);
  };

  const renderTasks = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => <TaskCard key={task.id} task={task} />);
  };

  return (
    <div className="task-board">
      {['Backlog', 'In Progress', 'Paused'].map((status) => (
        <div key={status} className="task-column">
          <h3>{status}</h3>
          {renderTasks(status)}
          <button onClick={() => openModal(status)}>+ Add a card</button>
        </div>
      ))}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        defaultStatus={currentStatus}
      />
    </div>
  );
};

export default TaskBoard;