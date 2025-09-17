using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Comments.Events;

public sealed record CommentCreatedDomainEvent(
    Guid Id,
    Guid TaskId,
    Guid AuthorId) : IDomainEvent;
