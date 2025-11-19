using FluentValidation;

namespace TeamHub.Application.Tasks.Commands.UnassignTask;

public sealed class UnassignTaskCommandValidator : AbstractValidator<UnassignTaskCommand>
{
    public UnassignTaskCommandValidator()
    {
        RuleFor(x => x.TaskId)
            .NotEmpty().WithMessage("Task ID cannot be empty.");
    }
}
