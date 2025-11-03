import { useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegFolderOpen } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineViewKanban } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import LogoTitle from "../LogoTitle/LogoTitle";

export default function Sidebar() {
  const location = useLocation();
  const [currentView, setCurrentView] = useState(location.pathname);

  const menuItems = [
    { name: "Dashboard", icon: IoHomeOutline, path: "/dashboard" },
    { name: "Projects", icon: FaRegFolderOpen, path: "/dashboard/projects" },
    { name: "Kanban Board", icon: MdOutlineViewKanban, path: "/dashboard/kanban" },
    { name: "Calendar", icon: CiCalendarDate, path: "/dashboard/calendar" },
    { name: "Messages", icon: FiMessageSquare, path: "/dashboard/messages" },
    { name: "Settings", icon: IoSettingsOutline, path: "/dashboard/settings" },
  ];

  return (
    <aside className="w-64 min-h-screen hidden lg:flex flex-col border-r border-gray-200">

        <div className="p-3.5 border-b border-gray-200 ">
            <LogoTitle />
        </div>

        <nav className="p-4 space-y-1">
            {menuItems.map(({ name, icon: Icon, path }) => {
            const isActive = currentView === path;
            return (
                <Link
                key={name}
                to={path}
                onClick={() => setCurrentView(path)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-150
                    ${isActive 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                    }`}
                >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{name}</span>
                </Link>
            );
            })}
        </nav>
    </aside>
  );
}
