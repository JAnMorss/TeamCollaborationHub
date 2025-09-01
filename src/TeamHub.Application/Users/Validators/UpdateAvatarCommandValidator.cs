using FluentValidation;
using TeamHub.Application.Users.Commands.UpdateAvatar;

namespace TeamHub.Application.Users.Validators;

public class UpdateAvatarCommandValidator : AbstractValidator<UpdateAvatarCommand>
{
    public UpdateAvatarCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage($"{nameof(UpdateAvatarCommand.UserId)} cannot be empty.");

        RuleFor(x => x.AvatarUrl)
            .NotEmpty().WithMessage($"{nameof(UpdateAvatarCommand.AvatarUrl)} cannot be empty.")
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("AvatarUrl must be a valid URL.");
    }
}
