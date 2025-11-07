import { LuUsers } from "react-icons/lu";
import { Link } from "react-router-dom";

interface LogoTitleProps {
  className?: string;
  collapsed?: boolean;
}

export default function LogoTitle({ className = "", collapsed = false }: LogoTitleProps) {
  return (
    <Link
      to="/"
      className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} ${className}`}
    >
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
        <LuUsers className="w-6 h-6 text-white" />
      </div>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${collapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"}
        `}
      >
        <span className="text-2xl font-bold text-gray-900 whitespace-nowrap">
          Team<span className="text-blue-500">Hub</span>
        </span>
      </div>
    </Link>
  );
}
