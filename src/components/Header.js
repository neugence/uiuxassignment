import React, { useState } from 'react';
import useTaskStore from '../stores/taskStore';
import { FaSun, FaMoon, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa'; // Icons for profile dropdown

const Header = () => {
  const { theme, toggleTheme } = useTaskStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Add logout functionality here
    alert('Logout clicked');
  };

  const handleSettings = () => {
    // Add settings functionality here
    alert('Settings clicked');
  };

  return (
    <header className="header">
      <h1>Smart Task Manager</h1>
      <div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        <div className="profile-container">
          <button className="profile-button" onClick={toggleDropdown}>
            <FaUser />
          </button>
          {isDropdownOpen && (
            <div className="profile-dropdown">
              <button onClick={handleSettings}>
                <FaCog /> Settings
              </button>
              <button onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;