using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Comments.Events;

public sealed record CommentUpdatedDomainEvent(Guid Id) : IDomainEvent;
