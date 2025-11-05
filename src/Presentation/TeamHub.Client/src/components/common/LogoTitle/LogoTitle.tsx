import { LuUsers } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function LogoTitle() {
  return (
    <div className="flex items-center space-x-3 ">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
        <LuUsers className="w-6 h-6 text-white" />
      </div>
      <Link to={"/"} className="text-2xl font-bold text-gray-900">
        Team<span className="text-blue-500">Hub</span>
      </Link>
    </div>
  );
}
