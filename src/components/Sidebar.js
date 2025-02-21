import React from 'react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h3>Filters</h3>
      <ul>
        <li>All</li>
        <li>Completed</li>
        <li>Pending</li>
      </ul>

      <h3>Sort By</h3>
      <ul>
        <li>Date</li>
        <li>Priority</li>
      </ul>
    </aside>
  );
};

export default Sidebar;