import Header from "../../components/common/Header/Header";
import SideBar from "../../components/common/SideBar/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainPage() {
  return (
    <div className="w-full flex min-h-screen bg-gray-50 overflow-hidden">
      <SideBar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200">
          <Header />
        </div>

        <div className="flex-1 px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
