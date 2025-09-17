using TeamHub.Application.Projects.Responses;
using TeamHub.Domain.Projects.Interface;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.Application.Projects.Queries.GetAllProjects;

public sealed class GetAllProjectsQueryHandler
    : IQueryHandler<GetAllProjectsQuery, PaginatedResult<ProjectResponse>>
{
    private readonly IProjectRepository _projectRepository;

    public GetAllProjectsQueryHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Result<PaginatedResult<ProjectResponse>>> Handle(
        GetAllProjectsQuery request, 
        CancellationToken cancellationToken)
    {
        var query = request.Query ?? new QueryObject();

        var projects = await _projectRepository.GetAllAsync(query, cancellationToken);

        var mapped = projects.Select(ProjectResponse.FromEntity).ToList();

        var totalCount = await _projectRepository.CountAsync(cancellationToken);

        var result = new PaginatedResult<ProjectResponse>(
            mapped,
            totalCount,
            query.Page,
            query.PageSize);

        return Result.Success(result);
    }
}
