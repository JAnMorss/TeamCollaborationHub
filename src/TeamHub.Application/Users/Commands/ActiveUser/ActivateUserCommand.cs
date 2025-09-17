using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Users.Commands.ActiveUser;

public sealed record ActivateUserCommand(Guid UserId) : ICommand;
