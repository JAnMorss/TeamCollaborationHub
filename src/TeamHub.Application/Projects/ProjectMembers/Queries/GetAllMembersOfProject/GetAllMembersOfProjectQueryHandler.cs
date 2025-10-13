using TeamHub.Application.Projects.Responses;
using TeamHub.Domain.ProjectMembers.Errors;
using TeamHub.Domain.ProjectMembers.Interface;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.Application.Projects.ProjectMembers.Queries.GetAllMembersOfProject;

public sealed class GetAllMembersOfProjectQueryHandler
    : IQueryHandler<GetAllMembersOfProjectQuery, PaginatedResult<ProjectMemberResponse>>
{
    private readonly IProjectMemberRepository _projectMemberRepository;

    public GetAllMembersOfProjectQueryHandler(IProjectMemberRepository projectMemberRepository)
    {
        _projectMemberRepository = projectMemberRepository;
    }

    public async Task<Result<PaginatedResult<ProjectMemberResponse>>> Handle(
        GetAllMembersOfProjectQuery request,
        CancellationToken cancellationToken)
    {
        var query = request.Query ?? new QueryObject();

        var members = await _projectMemberRepository.GetAllByProjectIdAsync(
            request.ProjectId,
            query,
            cancellationToken);

        if (members is null || !members.Any())
            return Result.Failure<PaginatedResult<ProjectMemberResponse>>(ProjectMemberErrors.NotFound);

        var mapped = members
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
