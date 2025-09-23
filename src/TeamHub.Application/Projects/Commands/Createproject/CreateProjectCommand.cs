using TeamHub.Application.Projects.Responses;
using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Projects.Commands.Createproject;

public sealed record CreateProjectCommand(
    Guid UserId,
    string Name,
    string Description,
    string Color) : ICommand<ProjectResponse>;
