using TeamHub.Application.Notifications.Responses;
using TeamHub.Domain.Notifications.Errors;
using TeamHub.Domain.Notifications.Interface;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Notifications.Queries.GetAllNotifications;

public sealed class GetAllNotificationsQueryHandler : IQueryHandler<GetAllNotificationsQuery, List<NotificationResponse>>
{
    private readonly INotificationRepository _notificationRepository;

    public GetAllNotificationsQueryHandler(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<Result<List<NotificationResponse>>> Handle(
        GetAllNotificationsQuery request, 
        CancellationToken cancellationToken)
    {
        var notifications = await _notificationRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        if (notifications is null || !notifications.Any())
            return Result.Failure<List<NotificationResponse>>(NotificationErrors.NotFound);

        var mapped = notifications
            .Select(NotificationResponse.FromEntity)
            .ToList();

        return Result.Success(mapped);
    }
}
