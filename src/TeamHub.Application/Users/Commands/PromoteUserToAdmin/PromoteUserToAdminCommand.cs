using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Users.Commands.PromoteUserToAdmin;

public sealed record PromoteUserToAdminCommand(Guid UserId) : ICommand;
