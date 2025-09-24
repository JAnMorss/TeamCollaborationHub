using TeamHub.Application.Projects.Responses;
using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Projects.Commands.UpdateProject;

public sealed record UpdateProjectCommand(
    Guid Id,
    string Name,
    string Description,
    string Color) : ICommand<ProjectResponse>;
