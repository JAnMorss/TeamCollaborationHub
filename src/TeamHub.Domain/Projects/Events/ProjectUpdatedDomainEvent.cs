using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Projects.Events;

public sealed record ProjectUpdatedDomainEvent(Guid Id) : IDomainEvent;
