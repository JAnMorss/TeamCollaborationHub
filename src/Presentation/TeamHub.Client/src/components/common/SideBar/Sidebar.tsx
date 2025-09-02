import { useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegFolderOpen } from "react-icons/fa";
import { FiMessageSquare, FiPlus } from "react-icons/fi";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineViewKanban } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Sidebar() {
     const [currentView, setCurrentView] = useState('dashboard');

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen relative hidden lg:block">
            <nav className="p-4 space-y-2">
                <Link
                    to={"/dashboard"} 
                    onClick={() => setCurrentView('dashboard')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                        currentView === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    >
                    <IoHomeOutline className="w-4 h-4"/>
                    <span>Dashboard</span>
                </Link>

                <Link 
                    to={"/dashboard/projects"}
                    onClick={() => setCurrentView('projects')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                        currentView === 'projects' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    >
                    <FaRegFolderOpen className="w-4 h-4 "/>
                    <span>Projects</span>
                </Link>
            
                <button 
                    onClick={() => setCurrentView('kanban')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                        currentView === 'kanban' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    >
                    <MdOutlineViewKanban className="w-4 h-4 "/>
                    <span>Kanban Board</span>
                </button>

                <button 
                    onClick={() => setCurrentView('calendar')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                        currentView === 'calendar' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    >
                    <CiCalendarDate className="w-4 h-4" />
                    <span>Calendar</span>
                </button>
                
                <button 
                    onClick={() => setCurrentView('messages')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                        currentView === 'messages' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    >
                    <FiMessageSquare  className="w-4 h-4" />
                    <span>Messages</span>
                </button>
                
                <button 
                    onClick={() => setCurrentView('settings')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                        currentView === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    >
                    <IoSettingsOutline  className="w-4 h-4" />
                    <span>Settings</span>
                </button>
            </nav>
        </aside>
        
    );
}