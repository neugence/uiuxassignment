import { StrictMode,react } from 'react'
import { createRoot } from 'react-dom/client'
import './../src/index.css'
import TaskManager from './Comps/TaskManager'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import store from './Redux/store'
import { BrowserRouter, Route, Routes } from 'react-router'
import TaskDashboard from './Comps/Dashboard'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <ToastContainer/>

      <BrowserRouter>
      <Routes>
        <Route path='/' element={<TaskManager/>}/>
        <Route path='/dashboard' element={<TaskDashboard/>}/>


      </Routes>
      </BrowserRouter>
   
    </Provider>
    
  </StrictMode>,
)
