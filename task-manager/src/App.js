import React, { useState } from 'react';
import TaskBoard from './components/TaskBoard';
import Modal from './components/Modal';
import './App.css';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="App">
      <h1>Task Manager</h1>
      
      <TaskBoard />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default App;
