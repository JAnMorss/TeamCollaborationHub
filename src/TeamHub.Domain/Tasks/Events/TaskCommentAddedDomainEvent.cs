using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Tasks.Events;

public sealed record TaskCommentAddedDomainEvent(
    Guid Id, 
    Guid commentId) : IDomainEvent;
