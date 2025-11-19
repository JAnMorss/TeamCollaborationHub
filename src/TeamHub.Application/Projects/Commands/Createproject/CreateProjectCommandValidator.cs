using FluentValidation;

namespace TeamHub.Application.Projects.Commands.Createproject;

public sealed class CreateProjectCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Project name cannot be empty.")
            .MaximumLength(100).WithMessage("Project name cannot exceed 100 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Project description cannot be empty.")
            .MaximumLength(500).WithMessage("Project description cannot exceed 500 characters.");

        RuleFor(x => x.Color)
            .NotEmpty().WithMessage("Project color cannot be empty.")
            .Matches("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
            .WithMessage("Project color must be a valid hex color code.");
    }
}
