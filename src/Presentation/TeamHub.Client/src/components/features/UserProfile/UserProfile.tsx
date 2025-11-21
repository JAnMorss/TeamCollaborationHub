import { useState } from "react";
import type { UserProfileDTO } from "../../../models/users/UserProfileDTO";
import { useNavigate } from "react-router-dom";
import { authApiConnector } from "../../../services/api/authApiConnector";

interface UserProfileProps {
  user: UserProfileDTO;
  avatarSrc?: string | null;
}

export default function UserProfile({ user, avatarSrc }: UserProfileProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const fullName = user.fullName;
  const initials = fullName
    ? fullName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  const handleProfileClick = () => setShowDropdown(!showDropdown);
  const handleSignOut = () => {
    authApiConnector.logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="relative">
      <button
        onClick={handleProfileClick}
        className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
        aria-label="User profile menu"
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover shadow-md"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
            {initials}
          </div>
        )}

        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">{fullName}</p>
          <p className="text-xs text-gray-500 truncate max-w-32">{user.email}</p>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-xl border border-base-300 z-50">
          <div className="p-3 border-b border-base-300">
            <p className="text-sm font-medium text-theme">{fullName}</p>
            <p className="text-xs text-muted">{user.email}</p>
          </div>

          <div className="py-1">
            <button className="w-full px-4 py-2 text-left text-sm text-muted hover:bg-gray-50">
              Profile Settings
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-muted hover:bg-gray-50">
              Account
            </button>
            <hr className="my-1" />
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
