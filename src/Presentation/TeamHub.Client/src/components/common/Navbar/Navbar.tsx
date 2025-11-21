import { useState } from "react";
import { LuUsers, LuLogIn } from "react-icons/lu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 bg-base-100 backdrop-blur-md z-50 shadow-sm">

      <div
        onClick={() => navigate("/")}
        className="flex items-center space-x-2 sm:space-x-4 cursor-pointer"
      >
        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
          <LuUsers className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-theme tracking-tight truncate">
          Team<span className="text-blue-600">Hub</span>
        </h1>
      </div>

      <div className="hidden sm:flex items-center space-x-4">
        {!token ? (
          <button
            onClick={() => navigate("/login")}
            className="px-4 sm:px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center space-x-2 shadow-sm"
          >
            <LuLogIn className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Login</span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 sm:px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center space-x-2 shadow-sm"
          >
            Dashboard
          </button>
        )}
      </div>

      <div className="sm:hidden flex items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {menuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-base-100 shadow-md flex flex-col items-center sm:hidden py-4 space-y-3 z-40">
          {!token ? (
            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center space-x-2"
            >
              <LuLogIn className="w-5 h-5" />
              <span>Login</span>
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/dashboard");
                setMenuOpen(false);
              }}
              className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center space-x-2"
            >
              Dashboard
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
