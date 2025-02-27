import React from 'react';
import useTaskStore from '../stores/taskStore';
import { FaSun, FaMoon } from 'react-icons/fa'; // Icons for light/dark mode

const Header = () => {
  const { theme, toggleTheme } = useTaskStore();

  return (
    <header className="header">
      <h1>Smart Task Manager</h1>
      <div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </div>
    </header>
  );
};

export default Header;