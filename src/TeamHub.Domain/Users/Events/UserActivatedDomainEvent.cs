using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Users.Events;

public sealed record UserActivatedDomainEvent(Guid Id) : IDomainEvent;