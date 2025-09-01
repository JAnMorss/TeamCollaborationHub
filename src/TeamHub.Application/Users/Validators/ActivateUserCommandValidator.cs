using FluentValidation;
using TeamHub.Application.Users.Commands.ActiveUser;

namespace TeamHub.Application.Users.Validators;

public class ActivateUserCommandValidator : AbstractValidator<ActivateUserCommand>
{
    public ActivateUserCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage($"{nameof(ActivateUserCommand.UserId)} cannot be empty.");
    }
}
