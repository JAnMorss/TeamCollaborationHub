using TeamHub.Domain.Notifications.Enums;
using TeamHub.Domain.Notifications.Errors;
using TeamHub.Domain.Notifications.Events;
using TeamHub.Domain.Notifications.ValueObjects;
using TeamHub.Domain.Projects.Entity;
using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel.Domain;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Notifications.Entity;

public sealed class Notification : BaseEntity
{
    private Notification() { }

    public Notification(
        Guid id,
        Title title,
        Message message, 
        NotificationType type, 
        bool isRead,
        ActionUrl actionUrl, 
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

    public Title? Title { get; private set; }
    public Message? Message { get; private set; }
    public NotificationType Type { get; private set; }
    public bool IsRead { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public ActionUrl? ActionUrl { get; private set; } 

    public Guid UserId { get; private set; }
    public Guid? ProjectId { get; private set; }
    public Guid? TaskId { get; private set; }
    public Guid? TriggeredById { get; private set; }

    public User? User { get; private set; }
    public Project? Project { get; private set; }
    public Task? Task { get; private set; }
    public User? TriggeredBy { get; private set; }

    public Result MarkAsRead()
    {
        if (IsRead)
            return Result.Failure(NotificationErrors.AlreadyRead);

        IsRead = true;
        RaiseDomainEvent(new MarkedAsReadDomainEvent(Id, UserId));

        return Result.Success();
    }

    public Result MarkAsUnread()
    {
        if (!IsRead)
            return Result.Failure(NotificationErrors.AlreadyUnread);

        IsRead = false;
        RaiseDomainEvent(new MarkedAsUnreadDomainEvent(Id, UserId));

        return Result.Success();
    }

    public Result UpdateActionUrl(string url)
    {
        var actionUrlResult = ActionUrl.Create(url);

        if (actionUrlResult.IsFailure)
            return Result.Failure(NotificationErrors.InvalidActionUrl);

        ActionUrl = actionUrlResult.Value;
        RaiseDomainEvent(new ActionUrlUpdatedDomainEvent(Id, UserId));

        return Result.Success();
    }
    public void AttachToProject(Guid projectId)
        => ProjectId = projectId;
    

    public void AttachToTask(Guid taskId)
        => TaskId = taskId;
    

}
