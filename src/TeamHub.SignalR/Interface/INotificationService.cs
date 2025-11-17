namespace TeamHub.SignalR.Interface;

public interface INotificationService
{
    Task SendToUser(Guid userId, string title, string message);
    Task SendToAll(string title, string message);
    Task SendToProjectMembers(IEnumerable<Guid> memberIds, string title, string message);
}
