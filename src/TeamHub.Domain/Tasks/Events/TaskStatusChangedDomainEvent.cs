using TeamHub.Domain.Tasks.Enums;
using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Tasks.Events;

public sealed record TaskStatusChangedDomainEvent(
    Guid Id,
    Taskstatus newStatus) : IDomainEvent;