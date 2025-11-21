import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserProfileDTO } from "../../../models/users/UserProfileDTO";
import NotificationBell from "../../features/UserNotifications/NotificationBell";
import UserProfile from "../../features/UserProfile/UserProfile";
import { getMyProfile, getUserAvatar } from "../../../services/api/userApiConnector";

export default function Header() {
  const [user, setUser] = useState<UserProfileDTO | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const userData = await getMyProfile();
        setUser(userData);

        const avatarData = await getUserAvatar();
        if (avatarData) setAvatarSrc(avatarData);

      } catch (error: any) {
        setError(error.message || "Failed to load user data");
        if (error.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="navbar bg-base-100 border-b border-base-300 px-4 sm:px-6 py-2 flex items-center justify-end">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="navbar bg-base-100 border-b border-base-300 px-4 sm:px-6 py-2 flex items-center justify-end">
        <div className="text-red-500">{error || "Failed to load user data"}</div>
      </div>
    );
  }

  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-4 sm:px-6 py-2 flex items-center justify-end">
      <div className="flex items-center space-x-4 sm:space-x-6">
        <NotificationBell />
        <UserProfile user={user} avatarSrc={avatarSrc} />
      </div>
    </header>
  );
}
