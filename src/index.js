import React from 'react';
import { createRoot } from 'react-dom/client'; // Use createRoot from react-dom/client
import App from './App';
import './styles.css';

// Create a root element
const root = createRoot(document.getElementById('root'));

// Render the App component
root.render(<App />);