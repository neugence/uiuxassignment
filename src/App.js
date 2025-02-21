import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import Footer from './components/Footer';
import './styles.css';

const App = () => {
  return (
    <div className="app">
      <Header />
      <div className="content">
        <Sidebar />
        <TaskList />
      </div>
      <Footer />
    </div>
  );
};

export default App;