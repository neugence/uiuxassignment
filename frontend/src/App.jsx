import { useState } from 'react'
import TaskBoard from './components/Taskboard'
import Dashboard from './components/Dashboard'
import {BrowserRouter, Route, Routes} from "react-router"



function App() {
 

  return (
    <>
    <BrowserRouter>
    <Routes>
            <Route path={"/"} element={<TaskBoard />}/>
            <Route path={"/dashboard"} element={<Dashboard/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
