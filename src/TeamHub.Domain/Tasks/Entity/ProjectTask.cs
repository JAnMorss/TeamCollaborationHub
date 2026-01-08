using TeamHub.Domain.ProjectMembers.Entity;
using TeamHub.Domain.Projects.Entity;
using TeamHub.Domain.TaskAttachments.Entity;
using TeamHub.Domain.Tasks.Enums;
using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.Events;
using TeamHub.Domain.Tasks.ValueObjects;
using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.ErrorHandling;
using TeamHub.SharedKernel.Repositories;

namespace TeamHub.Domain.Tasks.Entity;

public sealed class ProjectTask : BaseEntity, IUserOwned
{
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
    public DateTime? UpdatedAt { get; private set; } = DateTime.UtcNow;

    public Guid ProjectId { get; private set; }
    public Guid? AssignedToId { get; private set; }
    public Guid CreatedById { get; private set; }

    public Project? Project { get; private set; }
    public User? AssignedTo { get; private set; }
    public User? CreatedBy { get; private set; }
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
        var titleResult = ResultHelper.CreateOrFail(Title.Create, title);

        var descriptionResult = ResultHelper.CreateOrFail(Description.Create, description);

        var task = new ProjectTask(
            id,
            projectId,
            createdById,
            titleResult,
            descriptionResult,
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
        DateTime? dueDate,
        Taskstatus status)  
    {
        bool changed = false;

        if (!string.IsNullOrWhiteSpace(title) && title != Title?.Value)
        {
            var titleResult = ResultHelper.CreateOrFail(Title.Create, title);

            Title = titleResult;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(description) && description != Description?.Value)
        {
            var descriptionResult = ResultHelper.CreateOrFail(Description.Create, description);

            Description = descriptionResult;
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

        if (status != Status)
        {
            Status = status;
            changed = true;
            RaiseDomainEvent(new TaskStatusChangedDomainEvent(Id, status));
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

    public Result AssignTo(ProjectMember projectMember)
    {
        if (projectMember is null)
            return Result.Failure(TaskErrors.InvalidAssignment);

        if (ProjectId != projectMember.ProjectId)
            return Result.Failure(TaskErrors.InvalidAssignment);

        if (AssignedToId is not null)
            return Result.Failure(TaskErrors.AlreadyAssigned);

        AssignedToId = projectMember.UserId;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new TaskAssignedDomainEvent(Id, ProjectId));

        return Result.Success();
    }

    public Result Unassign()
    {
        if (AssignedToId is null)
            return Result.Failure(TaskErrors.NotAssigned);

        AssignedToId = null;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new TaskUnassignedDomainEvent(Id, ProjectId));

        return Result.Success();
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
