using TeamHub.Application.Projects.Responses;
using TeamHub.Domain.ProjectMembers.Interface;
using TeamHub.Domain.Projects.Errors;
using TeamHub.Domain.Projects.Interface;
using TeamHub.Domain.Users.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;
using TeamHub.SignalR.Abstractions;

namespace TeamHub.Application.Projects.ProjectMembers.Commands.AddProjectMember;

public sealed class AddProjectMemberCommandHandler : ICommandHandler<AddProjectMemberCommand, ProjectMemberResponse>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IProjectMemberRepository _projectMemberRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;

    public AddProjectMemberCommandHandler(
        IProjectRepository projectRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IProjectMemberRepository projectMemberRepository,
        INotificationService notificationService)
    {
        _projectRepository = projectRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _projectMemberRepository = projectMemberRepository;
        _notificationService = notificationService;
    }

    public async Task<Result<ProjectMemberResponse>> Handle(AddProjectMemberCommand request, CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);
        if (project is null)
            return Result.Failure<ProjectMemberResponse>(ProjectErrors.NotFound);

        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
            return Result.Failure<ProjectMemberResponse>(ProjectErrors.NotFound);

        var addMemberResult = project.AddMember(user, request.Role);
        if (addMemberResult.IsFailure)
            return Result.Failure<ProjectMemberResponse>(addMemberResult.Error);

        var member = addMemberResult.Value;

        await _projectMemberRepository.AddAsync(member, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _notificationService.SendNotificationToUser(
            user.Id,
            "Added to Project",
            $"You have been added to the project: {project.Name}"
        );

        return Result.Success(ProjectMemberResponse.FromEntity(member));
    }
}
