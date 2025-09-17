using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Tasks.Events;

public sealed record TaskCommentAddedDomainEvent(
    Guid Id, 
    Guid commentId) : IDomainEvent;
