import { useEffect, useState, useRef } from "react";
import { FaRegBell } from "react-icons/fa";
import type { NotificationDTO } from "../../../models/notifications/NotificationDTO";
import NotificationDropdown from "./NotificationDropdown";
import { createNotificationHub } from "../../../services/signalR/notificationHub";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    createNotificationHub((notif: NotificationDTO) => {
      setNotifications((prev) => [notif, ...prev]);
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      >
        <FaRegBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <NotificationDropdown
          ref={dropdownRef}
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}
