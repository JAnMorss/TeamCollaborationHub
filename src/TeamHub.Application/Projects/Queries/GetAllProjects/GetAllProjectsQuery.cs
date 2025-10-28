using TeamHub.Application.Projects.Responses;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;

namespace TeamHub.Application.Projects.Queries.GetAllProjects;

public sealed record GetAllProjectsQuery(
    QueryObject? Query,
    Guid UserId) : IQuery<PaginatedResult<ProjectResponse>>;
