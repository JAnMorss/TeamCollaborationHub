using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Tasks.TaskAttachments.Commands.RemoveTaskAttachment;

public sealed record RemoveTaskAttachmentCommand(Guid AttachmentId) : ICommand;