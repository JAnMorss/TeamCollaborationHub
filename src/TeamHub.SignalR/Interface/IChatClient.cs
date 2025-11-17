namespace TeamHub.SignalR.Interface;

public interface IChatClient
{
    Task ReceiveMessage(object message);
}
