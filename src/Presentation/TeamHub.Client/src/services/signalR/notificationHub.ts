import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:8080/hubs/notifications", {
    accessTokenFactory: () => localStorage.getItem("token") || "",
  })
  .withAutomaticReconnect()
  .build();

connection.on("ReceiveNotification", (message) => {
  console.log("🔔 Notification:", message);
});

export async function startConnection() {
  try {
    await connection.start();
    console.log("✅ SignalR Connected");
  } catch (err) {
    console.error("❌ SignalR Connection Error:", err);
    setTimeout(startConnection, 5000);
  }
}

export { connection };
