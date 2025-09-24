using FluentValidation;

namespace TeamHub.Application.Users.Commands.ActiveUser;

public class ActivateUserCommandValidator : AbstractValidator<ActivateUserCommand>
{
    public ActivateUserCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage($"{nameof(ActivateUserCommand.UserId)} cannot be empty.");
    }
}
