using TeamHub.Application.Projects.Responses;
using TeamHub.Application.Tasks.Responses;
using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Tasks.Commands.UpdateTask;

public sealed class UpdateTaskCommandHandler : ICommandHandler<UpdateTaskCommand, TaskResponse>
{
    private readonly ITaskRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateTaskCommandHandler(
        ITaskRepository taskRepository, 
        IUnitOfWork unitOfWork)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<TaskResponse>> Handle(
        UpdateTaskCommand request, 
        CancellationToken cancellationToken)
    {
        var task = await _taskRepository.GetByIdAsync(request.Id, cancellationToken);
        if (task is null)
            return Result.Failure<TaskResponse>(TaskErrors.NotFound);

        var updateResult = task.UpdateDetails(
            request.Title,
            request.Description,
            request.Priority,
            request.DueDate,
            request.Status);

        if (updateResult.IsFailure)
            return Result.Failure<TaskResponse>(updateResult.Error);

        await _taskRepository.UpdateAsync(task, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return TaskResponse.FromEntity(task);
    }
}
