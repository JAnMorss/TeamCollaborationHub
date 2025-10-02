using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Users.Events;

public sealed record UserDemotedToUserDomainEvent(Guid Id) : IDomainEvent;
