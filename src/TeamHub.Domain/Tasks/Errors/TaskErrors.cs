using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Tasks.Errors;

public static class TaskErrors
{
    public static readonly Error NotFound = new(
        "Task.NotFound",
        "The task with the specified identifier was not found.");

    public static readonly Error NoChanges = new(
        "Task.NoChanges",
        "No changes were detected in the task update.");

    public static readonly Error AlreadyInStatus = new(
        "Task.AlreadyInStatus",
        "The task is already in the specified status.");

    public static readonly Error AlreadyAssigned = new(
        "Task.AlreadyAssigned",
        "The task is already assigned to this user.");

    public static readonly Error InvalidComment = new(
        "Task.InvalidComment",
        "The provided comment is invalid.");

    public static readonly Error InvalidAttachment = new(
        "Task.InvalidAttachment",
        "The provided attachment is invalid.");
}
