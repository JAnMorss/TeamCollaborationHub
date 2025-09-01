using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Notifications.Events;

public sealed record ActionUrlUpdatedDomainEvent(
    Guid Id,
    Guid UserId) : IDomainEvent;
