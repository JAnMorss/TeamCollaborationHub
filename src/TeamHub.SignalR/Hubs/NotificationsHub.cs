using Microsoft.AspNetCore.SignalR;

namespace TeamHub.SignalR.Hubs;

public class NotificationsHub : Hub<INotificationClient>
{
    public override async Task OnConnectedAsync()
    {
        var userName = Context.User?.Identity?.Name ?? "Guest";

        await Clients.Caller.ReceiveNotification(new
        {
            Id = Guid.NewGuid(),
            Title = "Welcome!",
            Message = $"You’re now connected to TeamHub, {userName} 🎉",
            Time = DateTime.Now.ToString("HH:mm:ss"),
            IsRead = false
        });

        await Clients.All.ReceiveNotification(new
        {
            Id = Guid.NewGuid(),
            Title = "New Connection",
            Message = $"{userName} just joined TeamHub!",
            Time = DateTime.Now.ToString("HH:mm:ss"),
            IsRead = false
        });

        await base.OnConnectedAsync();
    }
}

public interface INotificationClient
{
    Task ReceiveNotification(object message);
}
