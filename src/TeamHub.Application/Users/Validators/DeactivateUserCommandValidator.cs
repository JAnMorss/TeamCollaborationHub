using FluentValidation;
using TeamHub.Application.Users.Commands.DeactivateUser;

namespace TeamHub.Application.Users.Validators;

public class DeactivateUserCommandValidator : AbstractValidator<DeactivateUserCommand>
{
    public DeactivateUserCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage($"{nameof(DeactivateUserCommand.UserId)} cannot be empty.");
    }
}
