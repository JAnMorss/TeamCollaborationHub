using TeamHub.Domain.TaskAttachments.Errors;
using TeamHub.Domain.TaskAttachments.Events;
using TeamHub.Domain.TaskAttachments.ValueObjects;
using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel.Domain;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.TaskAttachments.Entity;

public sealed class TaskAttachment : BaseEntity
{
    public TaskAttachment(
        Guid id,
        FileName? fileName,
        FilePath? filePath,
        FileType? fileType,
        FileSize fileSize, 
        DateTime uploadedAt, 
        Guid taskId, 
        Guid uploadedById) : base(id)
    {
        FileName = fileName;
        FilePath = filePath;
        FileType = fileType;
        FileSize = fileSize;
        UploadedAt = uploadedAt;
        TaskId = taskId;
        UploadedById = uploadedById;
    }

    public FileName? FileName { get; private set; }
    public FilePath? FilePath { get; private set; }
    public FileType? FileType { get; private set; }
    public FileSize FileSize { get; private set; }
    public DateTime UploadedAt { get; private set; }

    public Guid TaskId { get; private set; }
    public Guid UploadedById { get; private set; }

    public ProjectTask? Task { get; private set; }
    public User? UploadedBy { get; private set; }

    public Result Rename(string newFileName)
    {
        if (string.IsNullOrWhiteSpace(newFileName))
            return Result.Failure(TaskAttachmentErrors.InvalidFileName);

        var fileNameResult = FileName.Create(newFileName);
        if (fileNameResult.IsFailure)
            return Result.Failure(fileNameResult.Error);

        FileName = fileNameResult.Value;
        RaiseDomainEvent(new TaskAttachmentRenamedDomainEvent(Id));

        return Result.Success();
    }
}
