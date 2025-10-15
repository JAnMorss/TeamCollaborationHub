using TeamHub.Application.Projects.Responses;
using TeamHub.Domain.Projects.Errors;
using TeamHub.Domain.Projects.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Projects.Commands.UpdateProject;

public sealed class UpdateProjectCommandHandler : ICommandHandler<UpdateProjectCommand, ProjectResponse>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateProjectCommandHandler(
        IProjectRepository projectRepository, 
        IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ProjectResponse>> Handle(
        UpdateProjectCommand request, 
        CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);
        if (project is null)
            return Result.Failure<ProjectResponse>(ProjectErrors.NotFound);

        var updateResult = project.UpdateDetails(
            request.Name,
            request.Description,
            request.Color);

        if (updateResult.IsFailure)
            return Result.Failure<ProjectResponse>(updateResult.Error);

        await _projectRepository.UpdateAsync(project, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ProjectResponse.FromEntity(project);
    }
}
