import React from 'react';
import useTaskStore from '../stores/taskStore';

const Pagination = () => {
  const { tasks, currentPage, tasksPerPage, nextPage, prevPage } = useTaskStore();

  // Calculate the total number of pages
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  // Don't render pagination if there are no tasks
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="pagination">
      <button onClick={prevPage} disabled={currentPage === 1}>
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={nextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;