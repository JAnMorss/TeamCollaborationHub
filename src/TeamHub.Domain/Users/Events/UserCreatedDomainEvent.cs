using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Users.Events;

public sealed record UserCreatedDomainEvent(Guid Id) : IDomainEvent;
