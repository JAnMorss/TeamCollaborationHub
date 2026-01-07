using TeamHub.Application.Projects.Responses;
using TeamHub.Domain.Projects.Interface;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Projects.Queries.SearchProjectsByName;

public sealed class SearchProjectsByNameQueryHandler
    : IQueryHandler<SearchProjectsByNameQuery, PaginatedResult<ProjectResponse>>
{
    private readonly IProjectRepository _projectRepository;

    public SearchProjectsByNameQueryHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Result<PaginatedResult<ProjectResponse>>> Handle(
        SearchProjectsByNameQuery request, 
        CancellationToken cancellationToken)
    {
        var query = request.SearchQuery ?? new SearchQueryObject();

        var filteredProjects = await _projectRepository.SearchAsync(
                query, 
                request.UserId,
                cancellationToken);

        var mapped = filteredProjects.Select(ProjectResponse.FromEntity).ToList();

        var totalCount = await _projectRepository.CountByUserIdAsync(request.UserId, cancellationToken);

        var result = new PaginatedResult<ProjectResponse>(
            mapped,
            totalCount,
            query.Page,
            query.PageSize);

        return Result.Success(result);
    }
}
