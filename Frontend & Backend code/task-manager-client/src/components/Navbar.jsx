import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await logout();
      toast("Log out Successfully", {
        theme: "dark",
      });
    } catch (error) {
      toast("Log out Failed");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-transparent w-full z-50 fixed" ref={navbarRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between py-2">
          {/* Logo and Name */}
          <a href="/" className="flex gap-1 md:gap-3 items-center">
            <div className="flex-shrink-0">
              <img
                className="md:h-12 md:w-12 w-10 h-10"
                src="https://i.ibb.co.com/LhcHbQ8c/images-removebg-preview.png"
                alt="Logo"
              />
            </div>
            <div className="ml-2 text-lg md:text-2xl font-bold md:block hidden text-black">
              Task Manager
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-5 font-bold">
            {user && (
              <Link
                to="/dashboard/overview"
                className="border-2 border-purple-700 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-600 hover:text-white ease-in-out transition-all duration-300 text-xl cursor-pointer"
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogOut}
                className="border-2 border-purple-700 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-600 hover:text-white ease-in-out transition-all duration-300 text-xl cursor-pointer"
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/login"
                className="border-2 border-purple-700 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-600 hover:text-white ease-in-out transition-all duration-300 text-xl cursor-pointer"
              >
                Login
              </Link>
            )}
            {user ? (
              <img
                className="w-14 h-14 rounded-full"
                src={user?.photoURL}
                alt=""
              />
            ) : (
              ""
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex gap-4 items-center md:hidden">
            {user && (
              <div className="">
                <img
                  className="w-8 h-8 rounded-full"
                  src={user?.photoURL}
                  alt="User"
                />
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 focus:outline-none bg-purple-500 cursor-pointer"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-purple-400 via-purple-400 to-purple-400 duration-300 transition-all rounded-xl  shadow-lg w-60 absolute right-5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 font-semibold">
            <Link
              to="/"
              className="block text-black px-4 py-2 rounded-md hover:bg-purple-600 transition duration-300"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard/overview"
                  className="block text-black px-4 py-2 rounded-md hover:bg-purple-600 transition duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogOut}
                  className="block text-black px-4 py-2 rounded-md hover:bg-purple-600 transition duration-300"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-black px-4 py-2 rounded-md hover:bg-purple-600 transition duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
