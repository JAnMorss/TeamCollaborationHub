import { useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegFolderOpen } from "react-icons/fa";
import { FiMessageSquare, FiMenu, FiChevronLeft, FiChevronRight, FiSun, FiMoon } from "react-icons/fi";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineViewKanban } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import LogoTitle from "../LogoTitle/LogoTitle";
import { useTheme } from "../../../hooks/useTheme";

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggle } = useTheme();

  const menuItems = [
    { name: "Dashboard", icon: IoHomeOutline, path: "/dashboard" },
    { name: "Projects", icon: FaRegFolderOpen, path: "/dashboard/projects" },
    { name: "Tasks", icon: MdOutlineViewKanban, path: "/dashboard/tasks" },
    { name: "Calendar", icon: CiCalendarDate, path: "/dashboard/calendar" },
    { name: "Messages", icon: FiMessageSquare, path: "/dashboard/messages" },
    { name: "Settings", icon: IoSettingsOutline, path: "/dashboard/settings" },
  ];

  return (
    <>
      <button
        className="lg:hidden absolute top-2.5 left-4 z-30 p-2 rounded-md bg-base-100 border border-base-300 shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <FiMenu className="w-6 h-6 text-theme" />
      </button>

      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-base-100 border-r border-base-300
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        <div className="p-3.5 flex items-center justify-between relative">
          <LogoTitle collapsed={isCollapsed} />
          <button
            className="hidden lg:flex items-center justify-center w-6 h-6 text-muted 
                      bg-base-100 border border-base-300 rounded-full shadow-md 
                      hover:bg-gray-100 absolute right-[-12px] top-1/2 transform -translate-y-1/2"
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              onCollapseChange?.(!isCollapsed);
            }}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
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
                        : "text-muted hover:bg-blue-100 hover:text-blue-700"
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
        
        <div className="p-4 border-t border-base-300">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-muted"
          >
            {theme === 'dark' ? (
              <FiSun className="w-5 h-5" />
            ) : (
              <FiMoon className="w-5 h-5" />
            )}
            <span
              className={`ml-3 font-medium whitespace-nowrap transition-all duration-200 ${
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}
            >
              Toggle theme
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
