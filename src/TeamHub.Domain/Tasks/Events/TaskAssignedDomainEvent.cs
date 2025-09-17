using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Tasks.Events;

public sealed record TaskAssignedDomainEvent(
    Guid Id,
    Guid userId) : IDomainEvent;
