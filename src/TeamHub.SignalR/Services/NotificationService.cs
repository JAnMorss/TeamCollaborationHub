using Microsoft.AspNetCore.SignalR;
using TeamHub.SignalR.Hubs;
using TeamHub.SignalR.Interface;

namespace TeamHub.SignalR.Services;

public class NotificationService : INotificationService
{
    private readonly IHubContext<NotificationsHub, INotificationClient> _hubContext;

    public NotificationService(IHubContext<NotificationsHub, INotificationClient> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendToUser(Guid userId, string title, string message)
    {
        var conn = NotificationsHub.GetConnectionId(userId);
        if (conn is null) return;

        await _hubContext.Clients.Client(conn).ReceiveNotification(new
        {
            Title = title,
            Message = message,
            Time = DateTime.UtcNow,
            IsRead = false
        });
    }
    public async Task SendToAll(string title, string message)
    {
        await _hubContext.Clients.All.ReceiveNotification(new
        {
            Title = title,
            Message = message,
            Time = DateTime.UtcNow,
            IsRead = false
        });
    }

    public async Task SendToProjectMembers(IEnumerable<Guid> memberIds, string title, string message)
    {
        foreach(var memberId in memberIds)
        {
            var conn = NotificationsHub.GetConnectionId(memberId);
            if (conn != null)
            {
                await _hubContext.Clients.Client(conn).ReceiveNotification(new
                {
                    Title = title,
                    Message = message,
                    Time = DateTime.UtcNow,
                    IsRead = false
                });
            }
        }
    }
}
