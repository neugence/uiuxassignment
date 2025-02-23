import { Route, Routes } from "react-router-dom"
import DashboardPage from "./pages/dashboard/DashboardPage"
import LandingPage from "./pages/landing/LandingPage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import TimelinePage from "./pages/dashboard/TimelinePage"
import Navbar from "./components/Navbar"
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <div className="bg-zinc-50 min-h-screen">
          <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
            </Routes>
            <Toaster />
        </div>
    )
};

export default App
