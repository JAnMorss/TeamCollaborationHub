using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Users.Events;

public sealed record UserUpdatedDomainEvent(Guid Id) : IDomainEvent;
