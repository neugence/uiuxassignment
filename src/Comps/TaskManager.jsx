'use client'
import React, { useRef, useState } from 'react';
import TaskModal from '../Comps/TaskModal';
import ScheduledTask from './ScheduledTask';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import Header from './Header';

export default function TaskManager() {
  const tasks = useSelector(state => state.Tasks.tasks);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('');


  const openModal = (status) =>{
    setModalIsOpen(true);
    setDefaultStatus(status)
  } 
  const closeModal = () =>{
    setModalIsOpen(false);
    setDefaultStatus('')

  }

  return (
    <div className={`container mx-auto p-4 transition-all ${modalIsOpen ? 'opacity-80 blur-sm' : ''}`}>
      <Header/>

      <TaskModal isOpen={modalIsOpen} onRequestClose={closeModal}  edit='' task={null} status={defaultStatus} />

      {/* Horizontal Layout for Task Status */}
      <div className="flex gap-4 overflow-x-auto p-4">
        {[
          { status: "Backlog", color: "#FFEB99" },
          { status: "In_Progress", color: "#A7F3D0" },
          { status: "Ready_for_Launch", color: "#93C5FD" },
          { status: "Paused", color: "#FCD34D" },
          { status: "General_Information", color: "#D1D5DB" }
        ].map(({ status, color }) => (
          <div key={status} className="flex flex-col w-1/5 min-w-[250px] bg-opacity-90 p-4 rounded-lg shadow-md" style={{ backgroundColor: color }}>
            <h2 className="text-xl font-semibold text-center mb-4">{status}</h2>
            <ScheduledTask tasks={tasks} status={status} />
            <button onClick={()=>openModal(status)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full">
              + Add New Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
