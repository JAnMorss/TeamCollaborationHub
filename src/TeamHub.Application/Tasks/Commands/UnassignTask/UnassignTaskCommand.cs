using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Tasks.Commands.UnassignTask;

public sealed record UnassignTaskCommand(
    Guid TaskId,
    Guid UserId) : ICommand<Guid>;
