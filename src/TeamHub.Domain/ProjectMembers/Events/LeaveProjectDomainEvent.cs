using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.ProjectMembers.Events;

public sealed record LeaveProjectDomainEvent(
    Guid Id,
    Guid ProjectId,
    Guid UserId) : IDomainEvent;