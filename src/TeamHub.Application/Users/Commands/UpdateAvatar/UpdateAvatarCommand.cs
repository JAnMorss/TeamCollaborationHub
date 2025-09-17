using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Users.Commands.UpdateAvatar;

public sealed record UpdateAvatarCommand(
    Guid UserId, 
    string AvatarUrl) : ICommand;
