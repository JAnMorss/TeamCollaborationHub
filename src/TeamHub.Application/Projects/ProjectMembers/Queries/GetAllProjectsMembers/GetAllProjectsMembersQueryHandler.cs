using TeamHub.Application.Projects.Responses;
using TeamHub.Application.Tasks.Responses;
using TeamHub.Domain.ProjectMembers.Errors;
using TeamHub.Domain.ProjectMembers.Interface;
using TeamHub.Domain.Projects.Errors;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Projects.ProjectMembers.Queries.GetAllProjectsMembers;

internal class GetAllProjectsMembersQueryHandler
    : IQueryHandler<GetAllProjectsMembersQuery, PaginatedResult<ProjectMemberResponse>>
{
    private readonly IProjectMemberRepository _projectMemberRepository;

    public GetAllProjectsMembersQueryHandler(IProjectMemberRepository projectMemberRepository)
    {
        _projectMemberRepository = projectMemberRepository;
    }

    public async Task<Result<PaginatedResult<ProjectMemberResponse>>> Handle(
        GetAllProjectsMembersQuery request, 
        CancellationToken cancellationToken)
    {
        var query = request.Query ?? new QueryObject();

        var projectMember = await _projectMemberRepository.GetAllAsync(query, cancellationToken);
        if (projectMember is null)
            return Result.Failure<PaginatedResult<ProjectMemberResponse>>(ProjectMemberErrors.NotFound);

        var mapped = projectMember
            .Select(ProjectMemberResponse.FromEntity)
            .ToList();

        var totalCount = await _projectMemberRepository.CountAsync(cancellationToken);

        var result = new PaginatedResult<ProjectMemberResponse>(
            mapped,
            totalCount,
            query.Page,
            query.PageSize);

        return Result.Success(result);
    }
}
