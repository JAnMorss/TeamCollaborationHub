using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Projects.Events;

public sealed record ProjectMemberRemovedDomainEvent(
    Guid Id, 
    Guid userId) : IDomainEvent;
