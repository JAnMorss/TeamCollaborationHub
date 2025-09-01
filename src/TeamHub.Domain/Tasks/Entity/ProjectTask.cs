using TeamHub.Domain.Comments.Entity;
using TeamHub.Domain.Projects.Entity;
using TeamHub.Domain.TaskAttachments.Entity;
using TeamHub.Domain.Tasks.Enums;
using TeamHub.Domain.Tasks.ValueObjects;
using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Tasks.Entity;

public sealed class ProjectTask : BaseEntity
{
    private ProjectTask() { }

    public ProjectTask(
        Guid id,
        Title title,
        Description description,
        TaskPriority priority,
        Taskstatus status,
        DateTime? dueDate,
        DateTime updateAt,
        Guid projectId,
        Guid? assignedToId,
        Guid createdById) : base(id)
    {
        Title = title;
        Description = description;
        Priority = priority;
        Status = status;
        DueDate = dueDate;
        CreatedAt = DateTime.UtcNow;
        UpdateAt = updateAt;
        ProjectId = projectId;
        AssignedToId = assignedToId;
        CreatedById = createdById;
    }

    public Title? Title { get; private set; }
    public Description? Description { get; private set; }
    public TaskPriority Priority { get; private set; }
    public Taskstatus Status { get; private set; }
    public DateTime? DueDate { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdateAt { get; private set; }

    public Guid ProjectId { get; private set; }
    public Guid? AssignedToId { get; private set; }
    public Guid CreatedById { get; private set; }

    public Project? Project { get; private set; }
    public User? AssignedTo { get; private set; }
    public User? CreatedBy { get; private set; }
    public ICollection<Comment>? Comments { get; private set; }
    public ICollection<TaskAttachment>? Attachments { get; private set; }

}
