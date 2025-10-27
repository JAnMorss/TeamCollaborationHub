using Microsoft.AspNetCore.Http;
using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Users.Commands.UpdateUserAvatar;

public sealed record UpdateUserAvatarCommand(
    Guid UserId,
    IFormFile File) : ICommand;
