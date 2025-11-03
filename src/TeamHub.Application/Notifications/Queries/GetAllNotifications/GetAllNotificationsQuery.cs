using TeamHub.Application.Notifications.Responses;
using TeamHub.SharedKernel.Application.Mediator.Query;

namespace TeamHub.Application.Notifications.Queries.GetAllNotifications;

public sealed record GetAllNotificationsQuery(Guid UserId) : IQuery<List<NotificationResponse>>;