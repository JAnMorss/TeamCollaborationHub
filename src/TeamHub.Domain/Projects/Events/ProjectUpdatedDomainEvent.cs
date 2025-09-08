using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Projects.Events;

public sealed record ProjectUpdatedDomainEvent(Guid id) : IDomainEvent;
