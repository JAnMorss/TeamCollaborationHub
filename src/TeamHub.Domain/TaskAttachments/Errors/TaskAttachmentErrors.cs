using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.TaskAttachments.Errors;

public static class TaskAttachmentErrors
{
    public static readonly Error NotFound = new(
        "Project.NotFound",
        "The Project with the specified identifier was not found.");

    public static readonly Error InvalidFileName = new(
        "TaskAttachment.InvalidFileName",
        "The file name provided is invalid.");

    public static readonly Error UploadFailed = new(
        "Blob.UploadFailed",
        "Failed to upload file to blob storage");

}
