using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Projects.Events;

public sealed record ProjectCreatedDomainEvent(Guid Id) : IDomainEvent;
