using TeamHub.Application.Projects.Responses;
using TeamHub.Domain.Projects.Interface;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;
using TeamHub.SharedKernel.Domain.ErrorHandling;

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
        var query = request.Query ?? new QueryObject();

        var filteredProjects = await _projectRepository.SearchProjectsByNameAsync(
                request.Name, 
                query, 
                cancellationToken);

        var mapped = filteredProjects.Select(ProjectResponse.FromEntity).ToList();

        var totalCount = filteredProjects.Count();

        var result = new PaginatedResult<ProjectResponse>(
            mapped,
            totalCount,
            query.Page,
            query.PageSize);

        return Result.Success(result);
    }
}
