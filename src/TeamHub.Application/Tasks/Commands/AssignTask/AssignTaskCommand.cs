using TeamHub.Application.Tasks.Responses;
using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Tasks.Commands.AssignTask;

public sealed record AssignTaskCommand(
    Guid TaskId,
    Guid UserId) : ICommand<Guid>;
