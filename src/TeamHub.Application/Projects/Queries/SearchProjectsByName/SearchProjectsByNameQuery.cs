using TeamHub.Application.Projects.Responses;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;

namespace TeamHub.Application.Projects.Queries.SearchProjectsByName;

public sealed record SearchProjectsByNameQuery(
    string Name, 
    QueryObject Query) : IQuery<PaginatedResult<ProjectResponse>>;
