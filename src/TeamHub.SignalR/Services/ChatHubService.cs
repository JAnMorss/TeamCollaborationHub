using Microsoft.AspNetCore.SignalR;
using TeamHub.SignalR.Hubs;
using TeamHub.SignalR.Interface;

namespace TeamHub.SignalR.Services;

public class ChatHubService : IChatHubService
{
    private readonly IHubContext<ChatHub, IChatClient> _hubContext;

    public ChatHubService(IHubContext<ChatHub, IChatClient> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendMessageToTask(Guid taskId, object message)
    {
        await _hubContext.Clients.Group(taskId.ToString()).ReceiveMessage(message);
    }
}
