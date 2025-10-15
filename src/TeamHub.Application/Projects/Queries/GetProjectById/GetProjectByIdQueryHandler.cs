using TeamHub.Application.Projects.Responses;
using TeamHub.Domain.Projects.Errors;
using TeamHub.Domain.Projects.Interface;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Projects.Queries.GetProjectById;

public sealed class GetProjectByIdQueryHandler : IQueryHandler<GetProjectByIdQuery, ProjectResponse>
{
    private readonly IProjectRepository _projectRepository;

    public GetProjectByIdQueryHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Result<ProjectResponse>> Handle(
        GetProjectByIdQuery request, 
        CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);
        if (project is null)
            return Result.Failure<ProjectResponse>(ProjectErrors.NotFound);

        return ProjectResponse.FromEntity(project);
    }
}
