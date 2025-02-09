import { useState } from "react";

const Filter = ({ tasksFilter, setStatus, handleReset }) => {

    const [selectedTask, setSelectedTask] = useState("");

    const handleConfirm = () => {
        setStatus(selectedTask); // Apply the filter only when the Confirm button is clicked
      };

  return (
    <div>
      <div className="flex flex-row items-center gap-3">
        {/* Dropdown for year selection */}
        <select
          onChange={(e) => setSelectedTask(e.target.value)}
          value={selectedTask}
          aria-label="Filter by Year"
          className="py-2 px-5 ring-0 outline-hidden duration-300 transition-all ease-in-out cursor-pointer transform hover:bg-slate-400 hover:scale-105 border-2 rounded-xl font-semibold"
        >
          <option value="" disabled>
            Filter by Status
          </option>
          {tasksFilter?.length > 0 ? (
            tasksFilter.map((status) => (
              <option className="hover:bg-white hover:pl-4 rounded-xl" key={status} value={status}>
                {status}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No years available
            </option>
          )}
        </select>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          aria-label="Confirm Selection"
          className="md:px-4 p-1 md:py-1 flex items-center gap-2 bg-fuchsia-600 text-gray-100 font-semibold md:text-lg hover:bg-fuchsia-500 duration-150 hover:scale-105 rounded-lg cursor-pointer"
        >
          Confirm
        </button>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          aria-label="Reset Filters"
          className="md:px-4 md:py-1 p-1 flex items-center gap-2 bg-rose-600 text-gray-100 font-semibold md:text-lg hover:bg-rose-500 duration-150 hover:scale-105 rounded-lg focus:ring-2 focus:ring-green-400 cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Filter;
