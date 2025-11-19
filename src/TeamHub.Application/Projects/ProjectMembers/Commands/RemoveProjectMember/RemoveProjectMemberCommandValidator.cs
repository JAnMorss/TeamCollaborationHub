using FluentValidation;

namespace TeamHub.Application.Projects.ProjectMembers.Commands.RemoveProjectMember;

public sealed class RemoveProjectMemberCommandValidator : AbstractValidator<RemoveProjectMemberCommand>
{
    public RemoveProjectMemberCommandValidator()
    {
        RuleFor(x => x.ProjectId)
            .NotEmpty().WithMessage("Project ID cannot be empty.");
    }
}
