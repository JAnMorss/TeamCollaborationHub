using TeamHub.Application.Projects.Responses;
using TeamHub.SharedKernel.Application.Mediator.Query;

namespace TeamHub.Application.Projects.Queries.GetProjectById;

public sealed record GetProjectByIdQuery(Guid Id) : IQuery<ProjectResponse>;