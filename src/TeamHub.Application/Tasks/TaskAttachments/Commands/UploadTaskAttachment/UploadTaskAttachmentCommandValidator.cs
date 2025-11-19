using FluentValidation;

namespace TeamHub.Application.Tasks.TaskAttachments.Commands.UploadTaskAttachment;

public sealed class UploadTaskAttachmentCommandValidator : AbstractValidator<UploadTaskAttachmentCommand>
{
    public UploadTaskAttachmentCommandValidator()
    {
        RuleFor(x => x.TaskId)
            .NotEmpty().WithMessage("Task ID cannot be empty.");
    }
}
