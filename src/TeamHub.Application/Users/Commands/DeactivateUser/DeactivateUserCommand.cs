using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Users.Commands.DeactivateUser;

public sealed record DeactivateUserCommand(Guid UserId) : ICommand;
