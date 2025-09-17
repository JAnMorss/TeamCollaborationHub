using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Notifications.Events;

public sealed record MarkedAsUnreadDomainEvent(
    Guid Id,
    Guid UserId) : IDomainEvent;
