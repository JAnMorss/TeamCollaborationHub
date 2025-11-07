import { useState } from "react";
import Header from "../../components/common/Header/Header";
import Sidebar from "../../components/common/SideBar/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <Sidebar onCollapseChange={setIsSidebarCollapsed} />

      <main
        className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200">
          <Header />
        </div>

        <div className="flex-1 px-4 sm:px-6 md:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
