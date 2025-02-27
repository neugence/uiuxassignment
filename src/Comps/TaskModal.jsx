import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../Redux/Slices/TaskSlice';
import { assignees } from '../assigneeList';
import Multiselect from 'multiselect-react-dropdown';


const TaskModal = ({ isOpen, onRequestClose,edit,task,status}) => {
  const [TaskDetails, setTaskDetails] = useState({
    title: '',
    assignee: [],
    status:'' ,
    startDate: '',
    endDate: ''
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (edit && task) {
      setTaskDetails({
        title: task.title,
        assignee: task.assignee,
        status: task.status,
        startDate: task.startDate,
        endDate: task.endDate
      });
    }
  }, [edit, task]);

  useEffect(() => {
    Modal.setAppElement('body');
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onRequestClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(()=>{
    if(status){
      setTaskDetails(prev=>({...prev,status:status}))
    }
  },[status])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (edit) {
      dispatch(updateTask({ New: TaskDetails, old: task }));
    } else {
      dispatch(addTask(TaskDetails));
    }
    onRequestClose();
    setTaskDetails({
      title: '',
      assignee: [],
      status: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal fixed top-10 left-1/2 transform -translate-x-1/2 bg-white p-5 shadow-lg rounded-lg max-w-lg w-full sm:max-w-md md:max-w-lg"
    >
      <h2 className="text-2xl mb-4">{edit ? 'Edit Task' : 'Add Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            value={TaskDetails.title} // Ensure default empty string to prevent errors
            onChange={(e) =>
              setTaskDetails((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Assignee</label>
          <Multiselect
            className="text-black"
            options={assignees} // Directly pass the array of strings
            selectedValues={TaskDetails.assignee || []} // Ensure it's always an array
            onSelect={(selected) => setTaskDetails((prev) => ({ ...prev, assignee: selected }))}
            onRemove={(selected) => setTaskDetails((prev) => ({ ...prev, assignee: selected }))}
            isObject={false} // IMPORTANT: Since options are strings, set isObject to false
          />

        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Status</label>
          <select
            value={TaskDetails.status}
            onChange={(e) => setTaskDetails({ ...TaskDetails, status: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>Select Status</option>
            <option value="Backlog">Backlog</option>
            <option value="In_Progress">In Progress</option>
            <option value="Ready_for_Launch">Ready for Launch</option>
            <option value="Paused">Paused</option>
            <option value="General_Information">General Information</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {['startDate', 'endDate'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-bold mb-2">{field}</label>
              <input
                type="date"
                value={TaskDetails[field]}
                onChange={(e) =>
                  setTaskDetails({ ...TaskDetails, [field]: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button type="button" onClick={onRequestClose} className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {edit ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
