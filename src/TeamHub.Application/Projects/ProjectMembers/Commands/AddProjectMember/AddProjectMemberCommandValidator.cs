using FluentValidation;

namespace TeamHub.Application.Projects.ProjectMembers.Commands.AddProjectMember;

public sealed class AddProjectMemberCommandValidator : AbstractValidator<AddProjectMemberCommand>
{
    public AddProjectMemberCommandValidator()
    {
        RuleFor(x => x.ProjectId)
            .NotEmpty().WithMessage("Project ID cannot be empty.");
    }
}
