using TeamHub.Application.Projects.Responses;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;

namespace TeamHub.Application.Projects.ProjectMembers.Queries.GetAllProjectsMembers;

public sealed record GetAllProjectsMembersQuery(QueryObject? Query) : IQuery<PaginatedResult<ProjectMemberResponse>>;