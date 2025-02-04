import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import { store, persistor } from './redux/store'; // Import persistor

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store = {store}>
    
      <PersistGate loading={null} persistor={persistor}>
        <StrictMode>
          <App />
        </StrictMode>
      </PersistGate>
    
  </Provider>
)
