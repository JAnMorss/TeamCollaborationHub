import { useEffect, useState } from "react";
import type { UserDTO } from "../../../models/users/UserDto";
import type { NotificationDTO } from "../../../models/notifications/NotificationDTO";

import { userAPI } from "../../../services/api/userApiConnector";
import { notificationAPI } from "../../../services/api/notificationApiConnector";
import SearchBar from "../SearchBar/SearchBar";
import NotificationBell from "../../features/UserNotifications/NotificationBell";
import UserProfile from "../../features/UserProfile/UserProfile";
import LogoTitle from "../LogoTitle/LogoTitle";


export default function Header() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userData, notificationData] = await Promise.all([
          userAPI.getCurrentUser(),
          notificationAPI.getNotifications(),
        ]);
        setUser(userData);
        setNotifications(notificationData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="navbar bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="navbar bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-center">
        <div className="text-red-500">Failed to load user data</div>
      </div>
    );
  }

  return (
    <header className="navbar bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between shadow-sm">
      <LogoTitle />
      <SearchBar />
      <div className="flex items-center space-x-6">
        <NotificationBell notifications={notifications} />
        <UserProfile user={user} />
      </div>
    </header>
  );
}
