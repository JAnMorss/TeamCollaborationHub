using TeamHub.SharedKernel.Messaging.Command;

namespace TeamHub.Application.Users.Commands.DeactivateUser;

public sealed record DeactivateUserCommand(Guid UserId) : ICommand;
