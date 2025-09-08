using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Projects.Events;

public sealed record ProjectMemberAddedDomainEvent(
    Guid Id, 
    Guid userId) : IDomainEvent;
