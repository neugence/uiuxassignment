import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(true);
    }
  });

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center mr-4">
            <Link to="/" className="text-xl font-bold text-gray-900">
              TaskManager
            </Link>
          </div>
          
          <div className="flex items-center lg:gap-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className={location.pathname === '/dashboard' ? 'text-blue-500 border-b-2 border-b-blue-500 rounded-none' : ''}>
                    Dashboard
                  </Button>
                </Link>
                <Link to="/timeline">
                  <Button variant="ghost" className={location.pathname === '/timeline' ? 'text-blue-500 border-b-2 border-b-blue-500 rounded-none' : ''}>
                    Timeline
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;