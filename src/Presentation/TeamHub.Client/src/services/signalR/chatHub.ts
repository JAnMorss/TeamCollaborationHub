import * as signalR from "@microsoft/signalr";
import axios from "axios";
import type { ChatMessage } from "../../models/chat/ChatMessage";

const API_URL = "http://localhost:8080/api/v1/chat";

let connection: signalR.HubConnection | null = null;

export function createTaskChatHub(
  taskId: string,
  onReceiveMessage?: (msg: ChatMessage) => void
) {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:8080/", {
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log("✅ SignalR connected"))
      .catch((err) => console.error("SignalR start error:", err));

    connection.onreconnected(() => {
      console.log("✅ SignalR reconnected");
      connection?.invoke("JoinTaskGroup", taskId)
        .catch((err) => console.error("Failed to rejoin task group:", err));
    });
  }

  connection.invoke("JoinTaskGroup", taskId)
    .catch((err) => console.error("Failed to join task group:", err));

  if (onReceiveMessage) {
    connection.off(`ReceiveMessage-${taskId}`);
    connection.on(`ReceiveMessage-${taskId}`, onReceiveMessage);
  }

  return {
    connection,
    sendMessage: async (msg: ChatMessage) => {
      if (!connection) return;

      if (connection.state !== signalR.HubConnectionState.Connected) {
        await connection.start();
      }

      try {
        await connection.invoke("SendMessageToTask", taskId, msg);
        await axios.post(`${API_URL}/send`, msg, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } catch (err) {
        console.error("Failed to send/save message:", err);
        throw err;
      }
    },
    stop: () => connection?.stop(),
  };
}
