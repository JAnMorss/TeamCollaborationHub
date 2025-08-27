using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Users.Events;

public sealed record UserUpdatedDomainEvent(Guid Id) : IDomainEvent;
