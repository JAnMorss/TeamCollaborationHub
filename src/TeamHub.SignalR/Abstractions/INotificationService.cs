namespace TeamHub.SignalR.Abstractions;

public interface INotificationService
{
    Task SendNotificationToUser(Guid userId, string title, string message);
    Task SendNotificationToAll(string title, string message);
}
