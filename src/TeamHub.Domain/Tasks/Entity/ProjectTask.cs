using TeamHub.Domain.Comments.Entity;
using TeamHub.Domain.Projects.Entity;
using TeamHub.Domain.TaskAttachments.Entity;
using TeamHub.Domain.Tasks.Enums;
using TeamHub.Domain.Tasks.Events;
using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.ValueObjects;
using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Tasks.Entity;

public sealed class ProjectTask : BaseEntity
{
    private readonly List<Comment> _comments = new();
    private readonly List<TaskAttachment> _attachments = new();

    private ProjectTask() { }

    public ProjectTask(
        Guid id,
        Guid projectId,
        Guid createdById,
        Title title,
        Description description,
        TaskPriority priority,
        Taskstatus status,
        DateTime? dueDate) : base(id)
    {
        ProjectId = projectId;
        CreatedById = createdById;
        Title = title ?? throw new ArgumentNullException(nameof(title));
        Description = description ?? throw new ArgumentNullException(nameof(description));
        Priority = priority;
        Status = status;
        DueDate = dueDate;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;
        AssignedToId = null;
    }

    public Title Title { get; private set; } = null!;
    public Description Description { get; private set; } = null!;
    public TaskPriority Priority { get; private set; }
    public Taskstatus Status { get; private set; }
    public DateTime? DueDate { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Guid ProjectId { get; private set; }
    public Guid? AssignedToId { get; private set; }
    public Guid CreatedById { get; private set; }

    public Project? Project { get; private set; }
    public User? AssignedTo { get; private set; }
    public User? CreatedBy { get; private set; }
    public IReadOnlyCollection<Comment> Comments => _comments.AsReadOnly();
    public IReadOnlyCollection<TaskAttachment> Attachments => _attachments.AsReadOnly();

    public static Result<ProjectTask> Create(
        Guid id,
        Guid projectId,
        Guid createdById,
        string title,
        string description,
        TaskPriority priority,
        Taskstatus status,
        DateTime? dueDate)
    {
        var titleResult = Title.Create(title);
        if (titleResult.IsFailure)
            return Result.Failure<ProjectTask>(titleResult.Error);

        var descriptionResult = Description.Create(description);
        if (descriptionResult.IsFailure)
            return Result.Failure<ProjectTask>(descriptionResult.Error);

        var task = new ProjectTask(
            id,
            projectId,
            createdById,
            titleResult.Value,
            descriptionResult.Value,
            priority,
            status,
            dueDate);

        task.RaiseDomainEvent(new TaskCreatedDomainEvent(task.Id));

        return Result.Success(task);
    }

    public Result UpdateDetails(
        string title, 
        string description, 
        TaskPriority priority, 
        DateTime? dueDate)
    {
        bool changed = false;

        if (!string.IsNullOrWhiteSpace(title) && title != Title?.Value)
        {
            var titleResult = Title.Create(title);
            if (titleResult.IsFailure)
                return Result.Failure(titleResult.Error);

            Title = titleResult.Value;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(description) && description != Description?.Value)
        {
            var descriptionResult = Description.Create(description);
            if (descriptionResult.IsFailure)
                return Result.Failure(descriptionResult.Error);

            Description = descriptionResult.Value;
            changed = true;
        }

        if (priority != Priority)
        {
            Priority = priority;
            changed = true;
        }

        if (dueDate != DueDate)
        {
            DueDate = dueDate;
            changed = true;
        }

        if (!changed)
            return Result.Failure(TaskErrors.NoChanges);

        UpdatedAt = DateTime.UtcNow;
        RaiseDomainEvent(new TaskUpdatedDomainEvent(Id));

        return Result.Success(this);
    }

    public Result ChangeStatus(Taskstatus newStatus)
    {
        if (newStatus == Status)
            return Result.Failure(TaskErrors.AlreadyInStatus);

        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new TaskStatusChangedDomainEvent(Id, newStatus));

        return Result.Success(this);
    }

    public Result AssignTo(Guid userId)
    {
        if (AssignedToId == userId)
            return Result.Failure(TaskErrors.AlreadyAssigned);

        AssignedToId = userId;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new TaskAssignedDomainEvent(Id, userId));

        return Result.Success(this);
    }


    public Result AddAttachment(TaskAttachment attachment)
    {
        if (attachment is null)
            return Result.Failure(TaskErrors.InvalidAttachment);

        _attachments.Add(attachment);
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new TaskAttachmentAddedDomainEvent(Id, attachment.Id));

        return Result.Success(attachment);
    }
}
