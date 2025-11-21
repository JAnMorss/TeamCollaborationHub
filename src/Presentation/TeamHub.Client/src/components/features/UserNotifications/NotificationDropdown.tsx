import { forwardRef } from "react"; 
import type { NotificationDTO } from "../../../models/notifications/NotificationDTO";
import { FaRegBell } from "react-icons/fa";

interface NotificationDropdownProps {
  notifications: NotificationDTO[];
  onClose: () => void;
  onMarkAsRead: (notificationId: string) => void;
}

const NotificationDropdown = forwardRef<HTMLDivElement, NotificationDropdownProps>(
  ({ notifications, onClose, onMarkAsRead }, ref) => {

    const formatTime = (time: string) =>
      new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
      <div
        ref={ref}
        className="absolute right-0 mt-2 w-80 bg-base-100 rounded-lg shadow-xl border border-base-300 z-50 animate-in slide-in-from-top-2 duration-200"
      >
        <div className="p-4 border-b border-base-300 flex items-center justify-between">
          <h3 className="font-semibold text-theme">Notifications</h3>
          <button onClick={onClose} className="text-muted hover:text-theme text-sm">
            ✕
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-base-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaRegBell className="w-6 h-6 text-muted" />
              </div>
              <p className="text-sm text-muted">No notifications</p>
            </div>
          ) : (
              <div className="divide-y divide-base-300">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                    !notif.isRead ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        !notif.isRead ? "bg-blue-500" : "bg-transparent"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          !notif.isRead ? "font-semibold text-theme" : "text-theme"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-sm text-muted mt-1 line-clamp-2">{notif.message}</p>
                      <p className="text-xs text-muted mt-2">{formatTime(notif.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    );
  }
);

NotificationDropdown.displayName = "NotificationDropdown";
export default NotificationDropdown;
