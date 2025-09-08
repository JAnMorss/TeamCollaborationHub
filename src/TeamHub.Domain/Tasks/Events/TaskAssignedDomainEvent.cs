using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Tasks.Events;

public sealed record TaskAssignedDomainEvent(
    Guid Id,
    Guid userId) : IDomainEvent;
