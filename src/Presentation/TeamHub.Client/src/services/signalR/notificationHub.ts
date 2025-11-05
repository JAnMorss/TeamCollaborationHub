import * as signalR from "@microsoft/signalr";
import type { NotificationDTO } from "../../models/notifications/NotificationDTO";

let connection: signalR.HubConnection | null = null;

export function createNotificationHub(onNotification: (notif: NotificationDTO) => void) {
  if (typeof window === "undefined") return null; // browser check
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:8080/notifications", { 
      accessTokenFactory: () => localStorage.getItem("token") || "",
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("ReceiveNotification", (notif: NotificationDTO) => {
    onNotification(notif);
  });

  const startConnection = async () => {
    if (!connection) return;
    try {
      await connection.start();
      console.log("✅ SignalR Connected");
    } catch (err) {
      console.error("❌ SignalR Connection Error:", err);
      setTimeout(startConnection, 5000); // retry
    }
  };

  startConnection();

  return connection;
}
