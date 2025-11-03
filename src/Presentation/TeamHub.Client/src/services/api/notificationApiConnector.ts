import type { NotificationDTO } from "../../models/notifications/NotificationDTO";

export const notificationAPI = {
  getNotifications: async (): Promise<NotificationDTO[]> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/v1/notification", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.value || data || [];
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
      return [];
    }
  },
};
