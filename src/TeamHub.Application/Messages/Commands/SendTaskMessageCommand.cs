using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Messages.Commands;

public sealed record SendTaskMessageCommand(
    Guid TaskId,
    Guid SenderId,
    string Message) : ICommand<Guid>;