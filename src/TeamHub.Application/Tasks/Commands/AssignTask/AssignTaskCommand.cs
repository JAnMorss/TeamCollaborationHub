using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Tasks.Commands.AssignTask;

public sealed record AssignTaskCommand(
    Guid TaskId,
    Guid UserId,
    Guid OwnUserId) : ICommand<Guid>;
