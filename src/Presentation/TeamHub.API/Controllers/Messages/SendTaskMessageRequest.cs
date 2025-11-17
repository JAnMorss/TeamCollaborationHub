namespace TeamHub.API.Controllers.Messages;

public sealed record SendTaskMessageRequest(
    Guid TaskId,
    string Message);