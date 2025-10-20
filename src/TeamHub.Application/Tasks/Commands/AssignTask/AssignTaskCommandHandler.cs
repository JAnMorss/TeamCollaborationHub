using TeamHub.Domain.ProjectMembers.Interface;
using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Tasks.Commands.AssignTask;

public sealed class AssignTaskCommandHandler : ICommandHandler<AssignTaskCommand, Guid>
{
    private readonly ITaskRepository _taskRepository;
    private readonly IProjectMemberRepository _projectMemberRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AssignTaskCommandHandler(
        ITaskRepository taskRepository,
        IProjectMemberRepository projectMemberRepository,
        IUnitOfWork unitOfWork)
    {
        _taskRepository = taskRepository;
        _projectMemberRepository = projectMemberRepository;
        _unitOfWork = unitOfWork;
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

        return Result.Success(task.Id);
    }
}
