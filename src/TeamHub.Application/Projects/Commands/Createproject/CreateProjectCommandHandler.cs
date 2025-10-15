using TeamHub.Application.Projects.Responses;
using TeamHub.Domain.Projects.Entity;
using TeamHub.Domain.Projects.Interface;
using TeamHub.Domain.Users.Errors;
using TeamHub.Domain.Users.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Projects.Commands.Createproject;

public sealed class CreateProjectCommandHandler : ICommandHandler<CreateProjectCommand, ProjectResponse>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateProjectCommandHandler(
        IProjectRepository projectRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<Result<ProjectResponse>> Handle(
        CreateProjectCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
            return Result.Failure<ProjectResponse>(UserErrors.NotFound);

        var projectResult = Project.Create(
            Guid.NewGuid(),
            request.UserId,
            request.Name,
            request.Description,
            request.Color);

        if (projectResult.IsFailure)
            return Result.Failure<ProjectResponse>(projectResult.Error);

        var project = projectResult.Value;


        await _projectRepository.AddAsync(project, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(ProjectResponse.FromEntity(project));
    }
}
