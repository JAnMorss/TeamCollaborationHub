using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Users.Events;

public sealed record UserLoggedInDomainEvent(Guid Id) : IDomainEvent;
