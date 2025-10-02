using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Users.Events;

public sealed record UserPromotedToAdminDomainEvent(Guid Id) : IDomainEvent;
