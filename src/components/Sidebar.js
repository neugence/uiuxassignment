import React from 'react';
import useTaskStore from '../stores/taskStore';

const Sidebar = () => {
  const { setFilter, setSortBy } = useTaskStore();

  return (
    <aside className="sidebar">
      <h3>Filters</h3>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>

      <h3>Sort By</h3>
      <select onChange={(e) => setSortBy(e.target.value)}>
        <option value="date">Date</option>
        <option value="priority">Priority</option>
      </select>
    </aside>
  );
};

export default Sidebar;