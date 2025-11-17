using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using TeamHub.SignalR.Interface;

namespace TeamHub.SignalR.Hubs;

public class NotificationsHub : Hub<INotificationClient>
{
    private static readonly ConcurrentDictionary<Guid, string> _onlineUsers = new();
    public override async Task OnConnectedAsync()
    {
        var userIdString = Context.User?.FindFirst("sub")?.Value;
        if (Guid.TryParse(userIdString, out var userId))
        {
            _onlineUsers[userId] = Context.ConnectionId;

            await Clients.Caller.ReceiveNotification(new
            {
                Title = "Connected",
                Message = "You're now connected to TeamHub 🎉",
                Time = DateTime.Now,
                IsRead = false
            });
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userIdString = Context.User?.FindFirst("sub")?.Value;
        if (Guid.TryParse(userIdString, out var userId))
        {
            _onlineUsers.TryRemove(userId, out _);
        }

        await base.OnDisconnectedAsync(exception);
    }

    public static string? GetConnectionId(Guid userId)
        => _onlineUsers.TryGetValue(userId, out var connectionId)
            ? connectionId
            : null;
}