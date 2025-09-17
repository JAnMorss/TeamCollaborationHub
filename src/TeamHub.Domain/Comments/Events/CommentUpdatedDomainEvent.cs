using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Comments.Events;

public sealed record CommentUpdatedDomainEvent(Guid Id) : IDomainEvent;
