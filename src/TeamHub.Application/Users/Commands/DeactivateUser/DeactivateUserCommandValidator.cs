using FluentValidation;

namespace TeamHub.Application.Users.Commands.DeactivateUser;

internal sealed class DeactivateUserCommandValidator : AbstractValidator<DeactivateUserCommand>
{
    public DeactivateUserCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage($"{nameof(DeactivateUserCommand.UserId)} cannot be empty.");
    }
}
