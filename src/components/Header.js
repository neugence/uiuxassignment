import React, { useState } from 'react';
import useTaskStore from '../stores/taskStore';
import { FaSun, FaMoon, FaUser, FaCog, FaSignOutAlt, FaSearch } from 'react-icons/fa';

const Header = () => {
  const { theme, toggleTheme, setSearchQuery } = useTaskStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setSearchQuery(e.target.value);
  };

  return (
    <header className="header">
      <h1>Smart Task Manager</h1>
      <div>
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search tasks"
            value={searchText}
            onChange={handleSearch}
          />
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        <div className="profile-container">
          <button className="profile-button" onClick={toggleDropdown}>
            <FaUser />
          </button>
          {isDropdownOpen && (
            <div className="profile-dropdown">
              <button>
                <FaCog /> Settings
              </button>
              <button>
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