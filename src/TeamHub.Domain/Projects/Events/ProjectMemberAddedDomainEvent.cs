using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Projects.Events;

public sealed record ProjectMemberAddedDomainEvent(
    Guid Id, 
    Guid userId) : IDomainEvent;
