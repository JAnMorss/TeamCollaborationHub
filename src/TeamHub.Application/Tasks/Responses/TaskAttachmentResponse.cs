using TeamHub.Domain.TaskAttachments.Entity;

namespace TeamHub.Application.Tasks.Responses;

public sealed class TaskAttachmentResponse
{
    public Guid Id { get; set; }
    public Guid TaskId { get; set; }
    public string? FileName { get; set; }
    public string? FilePath { get; set; }
    public string? FileType { get; set; }
    public long FileSize { get; set; }
    public DateTime UploadedAt { get; set; }
    public Guid UploadedById { get; set; }
    public string? UploadedBy { get; set; }

    public static TaskAttachmentResponse FromEntity(TaskAttachment attachment)
    {
        if (attachment is null)
            throw new ArgumentNullException(nameof(attachment));

        var response = new TaskAttachmentResponse
        {
            Id = attachment.Id,
            TaskId = attachment.TaskId,
            FileName = attachment.FileName?.Value,
            FilePath = attachment.FilePath?.Value,
            FileType = attachment.FileType?.Value,
            FileSize = attachment.FileSize.Value,
            UploadedAt = attachment.UploadedAt,
            UploadedById = attachment.UploadedById,
            UploadedBy = attachment.UploadedBy is not null
                ? $"{attachment.UploadedBy.FirstName.Value} {attachment.UploadedBy.LastName.Value}"
                : null
        };

        return response;
    }
}
