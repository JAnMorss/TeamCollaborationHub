import Header from "../../components/common/Header/Header";
import SideBar from "../../components/common/SideBar/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainPage() {
  return (
    <>
        <Header />
        <div className="w-full relative flex overflow-x-hidden min-h-screen">
            <SideBar />
            <main className="flex-1 p-4 m-6">
                <Outlet />
            </main>
        </div>
    </>
    
  );
}
