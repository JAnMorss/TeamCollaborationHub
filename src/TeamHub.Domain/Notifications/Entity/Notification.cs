using TeamHub.Domain.Notifications.Enums;
using TeamHub.Domain.Projects.Entity;
using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Notifications.Entity;

public sealed class Notification : BaseEntity
{
    private Notification() { }

    public Notification(
        Guid id, 
        string title, 
        string message, 
        NotificationType type, 
        bool isRead,
        string actionUrl, 
        Guid userId, 
        Guid? projectId, 
        Guid? taskId, 
        Guid? triggeredById) : base(id)
    {
        Title = title;
        Message = message;
        Type = type;
        IsRead = isRead;
        CreatedAt = DateTime.UtcNow;
        ActionUrl = actionUrl;
        UserId = userId;
        ProjectId = projectId;
        TaskId = taskId;
        TriggeredById = triggeredById;
    }

    public string? Title { get; private set; }
    public string? Message { get; private set; }
    public NotificationType Type { get; private set; }
    public bool IsRead { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public string? ActionUrl { get; private set; } 

    public Guid UserId { get; private set; }
    public Guid? ProjectId { get; private set; }
    public Guid? TaskId { get; private set; }
    public Guid? TriggeredById { get; private set; }

    public User? User { get; private set; }
    public Project? Project { get; private set; }
    public Task? Task { get; private set; }
    public User? TriggeredBy { get; private set; }
}
