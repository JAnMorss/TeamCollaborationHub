using TeamHub.Domain.Notifications.Entity;

namespace TeamHub.Application.Notifications.Responses;

public sealed class NotificationResponse
{
    public Guid Id { get; init; }

    public string Title { get; init; } = string.Empty;

    public string Message { get; init; } = string.Empty;

    public string Type { get; init; } = string.Empty;

    public bool IsRead { get; init; }

    public DateTime CreatedAt { get; init; }

    public static NotificationResponse FromEntity(Notification notification)
    {
        return new NotificationResponse
        {
            Id = notification.Id,
            Title = notification.Title.Value,
            Message = notification.Message.Value,
            Type = notification.Type.ToString(),
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };
    }
}