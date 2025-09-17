using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Notifications.Events;

public sealed record ActionUrlUpdatedDomainEvent(
    Guid Id,
    Guid UserId) : IDomainEvent;
