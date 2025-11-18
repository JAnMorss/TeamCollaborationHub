import * as signalR from "@microsoft/signalr";
import type { NotificationDTO } from "../../models/notifications/NotificationDTO";

let connection: signalR.HubConnection | null = null;

export function createNotificationHub(onNotification: (notif: NotificationDTO) => void) {
  if (typeof window === "undefined") return null; // SSR safety
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:8080/hubs/notifications", {
        accessTokenFactory: () => localStorage.getItem("token") || "",
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("ReceiveNotification", (notif: NotificationDTO) => {
    console.log("📬 Notification received:", notif);
    onNotification(notif);
  });

  const startConnection = async () => {
    if (!connection) return;
    try {
      await connection.start();
      console.log("✅ SignalR Connected");
    } catch (err) {
      console.error("❌ SignalR Connection Error:", err);
      setTimeout(startConnection, 5000); // Retry
    }
  };

  startConnection();

  return connection;
}
