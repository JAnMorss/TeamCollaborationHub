using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.TaskAttachments.Errors;

public static class TaskAttachmentErrors
{
    public static readonly Error NotFound = new(
        "TaskAttachment.NotFound",
        "The task attachment with the specified identifier was not found.");

    public static readonly Error InvalidFileName = new(
        "TaskAttachment.InvalidFileName",
        "The file name provided is invalid.");

    public static readonly Error UploadFailed = new(
        "Blob.UploadFailed",
        "Failed to upload file to blob storage.");

    public static readonly Error AccessDenied = new(
        "TaskAttachment.AccessDenied",
        "You do not have permission to perform this action on this attachment.");
}
