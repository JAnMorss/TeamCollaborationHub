using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Users.Commands.DemoteUserToUser;

public sealed record DemoteUserToUserCommand(Guid UserId) : ICommand;
