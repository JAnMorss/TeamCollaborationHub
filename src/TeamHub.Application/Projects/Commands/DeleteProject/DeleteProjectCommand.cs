using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Projects.Commands.DeleteProject;

public sealed record DeleteProjectCommand(Guid Id) : ICommand<Guid>;
