using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Users.Events;

public sealed record UserAvatarUpdatedDomainEvent(Guid Id) : IDomainEvent;
