using Microsoft.AspNetCore.SignalR;
using TeamHub.SignalR.Interface;

namespace TeamHub.SignalR.Hubs;

public class ChatHub : Hub<IChatClient>
{
    public async Task JoinChat(Guid taskId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, taskId.ToString());
    }

    public async Task SendMessage(Guid taskId, Guid senderId, string message)
    {
        await Clients.Group(taskId.ToString()).ReceiveMessage(new
        {
            SenderId = senderId,
            Message = message,
            Time = DateTime.UtcNow
        });
    }
}
