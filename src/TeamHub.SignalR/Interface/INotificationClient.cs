namespace TeamHub.SignalR.Interface;

public interface INotificationClient
{
    Task ReceiveNotification(object message);
}
