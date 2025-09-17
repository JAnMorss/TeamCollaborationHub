using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Notifications.Events;

public sealed record MarkedAsReadDomainEvent(
    Guid Id, 
    Guid UserId) : IDomainEvent;
