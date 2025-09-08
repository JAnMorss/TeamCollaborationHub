using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Projects.Events;

public sealed record ProjectArchivedDomainEvent(Guid Id) : IDomainEvent;
