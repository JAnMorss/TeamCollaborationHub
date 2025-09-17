using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Tasks.Events;

public sealed record TaskUpdatedDomainEvent(Guid Id) : IDomainEvent;
