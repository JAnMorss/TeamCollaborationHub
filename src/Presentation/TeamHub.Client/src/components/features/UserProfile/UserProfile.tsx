import { useState } from "react";
import type { UserProfileDTO } from "../../../models/users/UserProfileDTO";

export default function UserProfile({ user }: { user: UserProfileDTO }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative">
      <button
        onClick={handleProfileClick}
        className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
        aria-label="User profile menu"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
          {initials}
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">{fullName}</p>
          <p className="text-xs text-gray-500 truncate max-w-32">{user.email}</p>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{fullName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <div className="py-1">
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
              Profile Settings
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
              Account
            </button>
            <hr className="my-1" />
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
