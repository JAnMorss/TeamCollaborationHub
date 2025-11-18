import * as signalR from "@microsoft/signalr";

export function createHubConnection<T>(
  hubUrl: string,
  eventName: string,
  onMessage: (data: T) => void
) {
  const token = localStorage.getItem("token") || "";

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on(eventName, (data: T) => {
    onMessage(data);
  });

  const start = async () => {
    try {
      await connection.start();
      console.log(`✅ Connected to ${hubUrl}`);
    } catch (err) {
      console.error(`❌ Error connecting to ${hubUrl}:`, err);
      setTimeout(start, 3000);
    }
  };

  start();

  return connection;
}
