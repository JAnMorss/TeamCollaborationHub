using FluentValidation;

namespace TeamHub.Application.Tasks.Commands.AssignTask;

public sealed class AssignTaskCommandValidator : AbstractValidator<AssignTaskCommand>
{
    public AssignTaskCommandValidator()
    {
        RuleFor(x => x.TaskId)
            .NotEmpty().WithMessage("Task ID cannot be empty.");
    }
}
