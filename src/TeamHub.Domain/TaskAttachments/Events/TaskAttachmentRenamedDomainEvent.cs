using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.TaskAttachments.Events;

public sealed record TaskAttachmentRenamedDomainEvent(Guid Id) : IDomainEvent;
