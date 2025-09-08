using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.TaskAttachments.Events;

public sealed record TaskAttachmentRenamedDomainEvent(Guid Id) : IDomainEvent;
