using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Notifications.Events;

public sealed record MarkedAsUnreadDomainEvent(
    Guid Id,
    Guid UserId) : IDomainEvent;
