import { useState } from "react";
import { CiCalendarDate, CiSearch } from "react-icons/ci";
import { FaRegFolderOpen } from "react-icons/fa";
import { FiMessageSquare, FiMenu, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineViewKanban } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import LogoTitle from "../LogoTitle/LogoTitle";

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    { name: "Dashboard", icon: IoHomeOutline, path: "/dashboard" },
    { name: "Projects", icon: FaRegFolderOpen, path: "/dashboard/projects" },
    { name: "Kanban Board", icon: MdOutlineViewKanban, path: "/dashboard/kanban" },
    { name: "Calendar", icon: CiCalendarDate, path: "/dashboard/calendar" },
    { name: "Messages", icon: FiMessageSquare, path: "/dashboard/messages" },
    { name: "Settings", icon: IoSettingsOutline, path: "/dashboard/settings" },
  ];

  return (
    <>
      <button
        className="lg:hidden absolute top-2.5 left-4 z-30 p-2 rounded-md bg-white border border-gray-200 shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <FiMenu className="w-6 h-6 text-gray-900" />
      </button>

      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        <div className="p-3.5 flex items-center justify-between relative">
          <LogoTitle collapsed={isCollapsed} />
          <button
            className="hidden lg:flex items-center justify-center w-6 h-6 text-gray-600 
                      bg-white border border-gray-300 rounded-full shadow-md 
                      hover:bg-gray-100 absolute right-[-12px] top-1/2 transform -translate-y-1/2"
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              onCollapseChange?.(!isCollapsed);
            }}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <div className="px-4 py-2">
          <div
            className={`flex items-center rounded-lg border border-gray-300 overflow-hidden transition-all duration-300 ease-in-out
              ${isCollapsed ? "justify-center" : ""}`}
          >
            <div className="flex-shrink-0 w-10 flex items-center justify-center">
              <CiSearch className="w-5 h-5 text-gray-400" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className={`transition-all duration-300 ease-in-out border-none focus:ring-0 focus:outline-none
                ${isCollapsed ? "w-0 opacity-0 p-0 ml-0" : "w-full opacity-100 ml-2 p-1"}`}
            />
          </div>
        </div>

        <nav className="p-4 lg:p-2 space-y-1 flex-1">
          {menuItems.map(({ name, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={name}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                  }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`ml-3 font-medium whitespace-nowrap transition-all duration-200
                    ${isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}
                >
                  {name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
