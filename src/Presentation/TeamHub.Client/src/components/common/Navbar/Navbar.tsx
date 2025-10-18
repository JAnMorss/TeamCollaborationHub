import { LuUsers, LuLogIn } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 bg-white/30 backdrop-blur-md z-50 shadow-sm">
      <div
        onClick={() => navigate("/")}
        className="flex items-center space-x-4 cursor-pointer"
      >
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
          <LuUsers className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Team<span className="text-blue-600">Hub</span>
        </h1>
      </div>

      {!token ? (
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center space-x-2 shadow-sm cursor-pointer"
        >
          <LuLogIn className="w-5 h-5" />
          <span>Login</span>
        </button>
      ) : (
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold items-center space-x-2 shadow-sm hidden sm:block cursor-pointer"
        >
          Dashboard
        </button>
      )}
    </nav>
  );
}
