using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Users.Events;

public sealed record UserDeactiveDomainEvent(Guid Id) : IDomainEvent;
