using TeamHub.Domain.ProjectMembers.Interface;
using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;
using TeamHub.SignalR.Interface;

namespace TeamHub.Application.Tasks.Commands.AssignTask;

public sealed class AssignTaskCommandHandler : ICommandHandler<AssignTaskCommand, Guid>
{
    private readonly ITaskRepository _taskRepository;
    private readonly IProjectMemberRepository _projectMemberRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;

    public AssignTaskCommandHandler(
        ITaskRepository taskRepository,
        IProjectMemberRepository projectMemberRepository,
        IUnitOfWork unitOfWork,
        INotificationService notificationService)
    {
        _taskRepository = taskRepository;
        _projectMemberRepository = projectMemberRepository;
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
    }

    public async Task<Result<Guid>> Handle(
        AssignTaskCommand request, 
        CancellationToken cancellationToken)
    {
        var task = await _taskRepository.GetByIdAsync(request.TaskId, cancellationToken);
        if (task is null)
            return Result.Failure<Guid>(TaskErrors.NotFound);

        var projectMember = await _projectMemberRepository
            .GetByProjectAndUserIdAsync(
                task.ProjectId, 
                request.UserId,
                cancellationToken);

        if (projectMember is null)
            return Result.Failure<Guid>(TaskErrors.InvalidAssignment);

        var assignResult = task.AssignTo(projectMember);
        if (assignResult.IsFailure)
            return Result.Failure<Guid>(assignResult.Error);

        await _taskRepository.UpdateAsync(task, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _notificationService.SendToUser(
            request.UserId,
            "Task Assigned",
            $"You've been assigned to task: {task.Title}"
        );

        return Result.Success(task.Id);
    }
}
