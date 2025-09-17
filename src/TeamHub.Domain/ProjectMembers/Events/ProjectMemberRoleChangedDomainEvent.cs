using TeamHub.Domain.ProjectMembers.Enums;
using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.ProjectMembers.Events;

public sealed record ProjectMemberRoleChangedDomainEvent(
    Guid Id,
    ProjectRole Role) : IDomainEvent;
