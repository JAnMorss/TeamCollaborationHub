import { useEffect, useState } from "react";
import type { UserProfileDTO } from "../../../models/users/UserProfileDTO";
import type { NotificationDTO } from "../../../models/notifications/NotificationDTO";

import { notificationAPI } from "../../../services/api/notificationApiConnector";
import SearchBar from "../SearchBar/SearchBar";
import NotificationBell from "../../features/UserNotifications/NotificationBell";
import UserProfile from "../../features/UserProfile/UserProfile";
import LogoTitle from "../LogoTitle/LogoTitle";
import { getMyProfile } from "../../../services/api/userApiConnector";

export default function Header() {
  const [user, setUser] = useState<UserProfileDTO | null>(null);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const userData = await getMyProfile();
      setUser(userData);

      const notificationData = await notificationAPI.getNotifications();
      setNotifications(notificationData);
    } catch (error) {
      console.error("Which one failed:", error);
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
