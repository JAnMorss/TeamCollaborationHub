using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Comments.Events;

public sealed record CommentCreatedDomainEvent(
    Guid Id,
    Guid TaskId,
    Guid AuthorId) : IDomainEvent;
