// src/components/Modal.jsx
import React, { useState, useEffect } from "react";
import { teamMembers } from "../store/teamMembers";

const Modal = ({ task, onClose, onSave }) => {

  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(task ? task.description : "");
  const [assignee, setAssignee] = useState(task ? task.assignee : null);
  const [status, setStatus] = useState(task ? task.status : "");
  const [startDate, setStartDate] = useState(task ? task.startDate : "");
  const [endDate, setEndDate] = useState(task ? task.endDate : "");

  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setAssignee(task.assignee);
      setStatus(task.status);
      setStartDate(task.startDate || "");
      setEndDate(task.endDate || "");
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      assignee,
      status,
      startDate: startDate || null,
      endDate: endDate || null,
    });
  };

  return (
    <div className="modal modal-open ">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{task ? "Edit Task" : "Add Task"}</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="Task Title"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Task Description"
            className="textarea textarea-bordered w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <div className="relative">
            <label className="block mb-1">Assignee</label>
            <div className="flex items-center">
              {assignee ? (
                <img
                  src={assignee.dp}
                  alt={assignee.name}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
              )}
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
              >
                {showAssigneeDropdown ? " x " : "+"}
              </button>
            </div>
            {showAssigneeDropdown && (
              <ul className="absolute z-10 w-full border bg-slate-100 mt-1 shadow rounded-xl">
                {teamMembers.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setAssignee(member);
                      setShowAssigneeDropdown(false);
                    }}
                  >
                    <img
                      src={member.dp}
                      alt={member.name}
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                    <span>{member.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="text"
            placeholder="Status Folder Name"
            className="input input-bordered w-full capitalize"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          <div className="flex space-x-2">
            <input
              type="date"
              className="input input-bordered w-full text-slate-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="input input-bordered w-full text-slate-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn hover:btn-accent" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
