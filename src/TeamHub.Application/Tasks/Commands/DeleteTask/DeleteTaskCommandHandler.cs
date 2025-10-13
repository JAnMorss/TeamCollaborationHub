using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.Application.Tasks.Commands.DeleteTask;

public sealed class DeleteTaskCommandHandler : ICommandHandler<DeleteTaskCommand, Guid>
{
    private readonly ITaskRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;
    public DeleteTaskCommandHandler(
        ITaskRepository taskRepository, 
        IUnitOfWork unitOfWork)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<Result<Guid>> Handle(
        DeleteTaskCommand request, 
        CancellationToken cancellationToken)
    {
        var task = await _taskRepository.GetByIdAsync(request.Id, cancellationToken);
        if (task is null)
            return Result.Failure<Guid>(TaskErrors.NotFound);

        await _taskRepository.DeleteAsync(task.Id, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(task.Id);
    }
}
