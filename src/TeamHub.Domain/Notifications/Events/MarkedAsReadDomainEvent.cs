using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Notifications.Events;

public sealed record MarkedAsReadDomainEvent(
    Guid Id, 
    Guid UserId) : IDomainEvent;
