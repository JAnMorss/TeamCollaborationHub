using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Tasks.Events;

public sealed record TaskUnassignedDomainEvent(Guid Id, Guid ProjectId) : IDomainEvent;
