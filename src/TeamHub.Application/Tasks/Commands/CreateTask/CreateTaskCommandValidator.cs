using FluentValidation;

namespace TeamHub.Application.Tasks.Commands.CreateTask;

public sealed class CreateTaskCommandValidator : AbstractValidator<CreateTaskCommand>
{
    public CreateTaskCommandValidator()
    {
        RuleFor(x => x.ProjectId)
            .NotEmpty().WithMessage("Project ID cannot be empty.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Task title cannot be empty.")
            .MaximumLength(100).WithMessage("Task title cannot exceed 100 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Task description cannot be empty.")
            .MaximumLength(500).WithMessage("Task description cannot exceed 500 characters.");

        RuleFor(x => x.Priority)
            .IsInEnum().WithMessage("Task priority must be a valid value.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Task status must be a valid value.");

        RuleFor(x => x.DueDate)
            .GreaterThan(DateTime.UtcNow)
            .When(x => x.DueDate != null)
            .WithMessage("Due date must be in the future.");
    }
}
