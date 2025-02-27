import React, { useState } from 'react';
import { FaEdit } from "react-icons/fa";
import TaskModal from './TaskModal';

export default function ScheduledTask({ tasks, status, color }) {
  const [showModal, setShowModal] = useState({ set: false, index: null });
  const Filtered = tasks.filter(task => task.status === status) || []

  return (
    <>
      {

        Filtered.length > 0
          ?
          <div className="w-full  bg-white rounded shadow-lg mx-2 ">
            {
              Filtered.map((task, index) => (
                <div key={index} className="p-4 rounded  shadow-lg " style={{ background: color }}>
                  <p className="font-bold">{task.title}</p>
                  <p className="text-sm">
                    Assignee: {Array.isArray(task.assignee) ? task.assignee.join(", ") : String(task.assignee || "No assignees")}
                  </p>
                  <p className="text-sm">Start: {task.startDate}</p>
                  <p className="text-sm">End: {task.endDate}</p>
                  <div className="text-right">
                    <button title="Edit" className="cursor-pointer" onClick={() => setShowModal({ set: true, index })}>
                      <FaEdit />
                    </button>
                  </div>
                  {showModal.set && showModal.index === index && (
                    <TaskModal isOpen={showModal.set} onRequestClose={() => setShowModal({ set: false, task: null })} edit={true} task={task} status='' />
                  )}
                </div>
              ))
            }
            </div>
            :
            ''

           
      }
          
    </>
  );
}
