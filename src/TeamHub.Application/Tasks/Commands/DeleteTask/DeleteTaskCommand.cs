using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Tasks.Commands.DeleteTask;

public sealed record DeleteTaskCommand(Guid Id) : ICommand<Guid>;
