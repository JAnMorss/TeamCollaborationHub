using TeamHub.Application.Projects.Responses;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;

namespace TeamHub.Application.Projects.ProjectMembers.Queries.GetAllMembersOfProject;

public sealed record GetAllMembersOfProjectQuery(
    Guid ProjectId,
    QueryObject Query) : IQuery<PaginatedResult<ProjectMemberResponse>>;
