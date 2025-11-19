using FluentValidation;

namespace TeamHub.Application.Tasks.TaskAttachments.Commands.RemoveTaskAttachment;

public sealed class RemoveTaskAttachmentCommandValidator : AbstractValidator<RemoveTaskAttachmentCommand>
{
    public RemoveTaskAttachmentCommandValidator()
    {
        RuleFor(x => x.AttachmentId)
            .NotEmpty().WithMessage("Task Attachment ID cannot be empty.");
    }
}
