import React from 'react';
import useTaskStore from '../stores/taskStore';
import { FaSun, FaMoon, FaUser } from 'react-icons/fa'; // Icons for light/dark mode and profile

const Header = () => {
  const { theme, toggleTheme } = useTaskStore();

  return (
    <header className="header">
      <h1>Smart Task Manager</h1>
      <div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        <button className="profile-button">
          <FaUser />
        </button>
      </div>
    </header>
  );
};

export default Header;