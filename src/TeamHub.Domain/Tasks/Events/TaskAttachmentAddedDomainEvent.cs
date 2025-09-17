using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Tasks.Events;

public sealed record TaskAttachmentAddedDomainEvent(
    Guid Id,
    Guid attachmentId) : IDomainEvent;
