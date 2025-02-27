import React, { useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import Pagination from './components/Pagination';
import Footer from './components/Footer';
import useTaskStore from './stores/taskStore';
import './styles.css';

const App = () => {
  const { theme } = useTaskStore();

  // Apply the theme to the root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app">
      <Header />
      <div className="content">
        <Sidebar />
        <TaskList />
        <Pagination />
      </div>
      <Footer />
    </div>
  );
};

export default App;