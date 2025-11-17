namespace TeamHub.SignalR.Interface;

public interface IChatHubService
{
    Task SendMessageToTask(Guid taskId, object message);
}
