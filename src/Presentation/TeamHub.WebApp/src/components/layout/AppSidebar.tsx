"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CheckSquare,
  Calendar,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";

export default function AppSidebar() {
  const { logout } = useAuth();

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/dashboard/projects", icon: FolderKanban, label: "Projects" },
    { to: "/dashboard/members", icon: Users, label: "Members" },
    { to: "/dashboard/tasks", icon: CheckSquare, label: "Tasks" },
    { to: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
  ];

  return (
    <SidebarProvider>
      <SidebarTrigger className="md:hidden p-2" />
      <Sidebar
        collapsible="offcanvas"
        className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800"
      >
        <SidebarContent className="flex flex-col h-full">
          <SidebarHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 cursor-default select-none">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                TeamHub
              </span>
            </div>
          </SidebarHeader>

          <SidebarMenu className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={logout}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
