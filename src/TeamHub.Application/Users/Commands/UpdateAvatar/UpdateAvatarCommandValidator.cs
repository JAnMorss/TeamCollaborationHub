using FluentValidation;

namespace TeamHub.Application.Users.Commands.UpdateAvatar;

internal sealed class UpdateAvatarCommandValidator : AbstractValidator<UpdateAvatarCommand>
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
