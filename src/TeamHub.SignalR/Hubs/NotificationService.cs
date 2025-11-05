using Microsoft.AspNetCore.SignalR;
using TeamHub.SignalR.Abstractions;

namespace TeamHub.SignalR.Hubs;

public class NotificationService : INotificationService
{
    private readonly IHubContext<NotificationsHub, INotificationClient> _hubContext;

    public NotificationService(IHubContext<NotificationsHub, INotificationClient> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendNotificationToUser(
        Guid userId,
        string title,
        string message)
    {
        await _hubContext.Clients.User(userId.ToString()).ReceiveNotification(new
        {
            Id = Guid.NewGuid(),
            Title = title,
            Message = message,
            Time = DateTime.Now.ToString("HH:mm:ss"),
            IsRead = false
        });
    }

    public async Task SendNotificationToAll(
        string title,
        string message)
    {
        await _hubContext.Clients.All.ReceiveNotification(new
        {
            Id = Guid.NewGuid(),
            Title = title,
            Message = message,
            Time = DateTime.Now.ToString("HH:mm:ss"),
            IsRead = false
        });
    }
}
