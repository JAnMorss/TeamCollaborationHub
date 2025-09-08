using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Tasks.Events;

public sealed record TaskAttachmentAddedDomainEvent(
    Guid Id,
    Guid attachmentId) : IDomainEvent;
