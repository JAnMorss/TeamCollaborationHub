import { forwardRef } from "react";
import type { NotificationDTO } from "../../../models/notifications/NotificationDTO";
import { FaRegBell } from "react-icons/fa";

interface NotificationDropdownProps {
  notifications: NotificationDTO[];
  onClose: () => void;
}

const NotificationDropdown = forwardRef<HTMLDivElement, NotificationDropdownProps>(
  ({ notifications, onClose }, ref) => {
    const handleNotificationClick = (notificationId: string) => {
      // Handle notification click (e.g., mark as read, navigate)
      console.log("Notification clicked:", notificationId);
    };

    const formatTime = (time: string) => {
      return time;
    };

    return (
      <div
        ref={ref}
        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200"
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm"
            aria-label="Close notifications"
          >
            ✕
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaRegBell className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                    !notif.isRead ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      !notif.isRead ? "bg-blue-500" : "bg-transparent"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium text-gray-900 ${
                        !notif.isRead ? "font-semibold" : ""
                      }`}>
                        {notif.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatTime(notif.time)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200">
            <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all notifications
            </button>
          </div>
        )}
      </div>
    );
  }
);

NotificationDropdown.displayName = "NotificationDropdown";
export default NotificationDropdown;