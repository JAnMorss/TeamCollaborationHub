using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Tasks.Commands.UnassignTask;

public sealed class UnassignTaskCommandHandler : ICommandHandler<UnassignTaskCommand, Guid>
{
    private readonly ITaskRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;
    public UnassignTaskCommandHandler(
        ITaskRepository taskRepository, 
        IUnitOfWork unitOfWork)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(
        UnassignTaskCommand request, 
        CancellationToken cancellationToken)
    {
        var task = await _taskRepository.GetByIdAndUserIdAsync(request.TaskId, request.UserId, cancellationToken);
        if (task is null)
            return Result.Failure<Guid>(TaskErrors.NotFound);

        var unAssignResult = task.Unassign();
        if (unAssignResult.IsFailure)
            return Result.Failure<Guid>(unAssignResult.Error);

        await _taskRepository.UpdateAsync(task, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(task.Id);
    }
}
