using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Tasks.Events;

public sealed record TaskUpdatedDomainEvent(Guid Id) : IDomainEvent;
