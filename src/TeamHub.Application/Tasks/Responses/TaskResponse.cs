using TeamHub.Domain.Tasks.Entity;

namespace TeamHub.Application.Tasks.Responses;

public sealed class TaskResponse
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public Guid CreatedById { get; set; }
    public Guid? AssignedToId { get; set; }

    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Priority { get; set; }
    public string? Status { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }

    public string? CreatedBy { get; set; }
    public string? AssignedTo { get; set; }

    public object Comments { get; set; } = new();
    public object Attachments { get; set; } = new();

    public static TaskResponse FromEntity(ProjectTask task)
    {
        var response = new TaskResponse
        {
            Id = task.Id,
            ProjectId = task.ProjectId,
            CreatedById = task.CreatedById,
            AssignedToId = task.AssignedToId,

            Title = task.Title?.Value,
            Description = task.Description?.Value,
            Priority = task.Priority.ToString(),
            Status = task.Status.ToString(),
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt,

            CreatedBy = task.CreatedBy is not null
                        ? $"{task.CreatedBy.FirstName.Value} {task.CreatedBy.LastName.Value}"
                        : null,

            AssignedTo = task.AssignedTo is not null
                        ? $"{task.AssignedTo.FirstName.Value} {task.AssignedTo.LastName.Value}"
                        : null
        };

        response.Comments = task.Comments is null || !task.Comments.Any()
            ? "No comments yet."
            : task.Comments
                .Select(c => new
                {
                    c.Id,
                    Content = c.Content.Value,
                    Author = c.Author is not null
                             ? $"{c.Author.FirstName.Value} {c.Author.LastName.Value}"
                             : null,
                    c.CreatedAt,
                    c.IsEdited
                })
                .ToList();

        response.Attachments = task.Attachments is null || !task.Attachments.Any()
            ? "No attachments yet."
            : task.Attachments
                .Select(a => new
                {
                    a.Id,
                    FileName = a.FileName.Value,
                    FilePath = a.FilePath.Value,
                    FileType = a.FileType.Value,
                    FileSize = a.FileSize.Value,
                    a.UploadedAt
                })
                .ToList();

        return response;
    }
}
