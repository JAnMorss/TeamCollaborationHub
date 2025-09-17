using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.Domain.Notifications.Errors;

public static class NotificationErrors
{
    public static readonly Error NotFound = new(
        "Notification.NotFound",
        "The notification with the specified identifier was not found.");

    public static readonly Error AlreadyRead = new(
        "Notification.AlreadyRead",
        "The notification is already marked as read.");

    public static readonly Error AlreadyUnread = new(
        "Notification.AlreadyUnread",
        "The notification is already marked as unread.");

    public static readonly Error InvalidActionUrl = new(
        "Notification.InvalidActionUrl",
        "The action URL must be a valid HTTP or HTTPS address.");
}