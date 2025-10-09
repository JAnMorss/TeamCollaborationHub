using TeamHub.Application.Projects.Responses;
using TeamHub.Application.Tasks.Responses;
using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.Application.Tasks.Queries.GetTaskById;

public sealed class GetTaskByIdQueryHandler : IQueryHandler<GetTaskByIdQuery, TaskResponse>
{
    private readonly ITaskRepository _taskRepository;
    public GetTaskByIdQueryHandler(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<Result<TaskResponse>> Handle(
        GetTaskByIdQuery request, 
        CancellationToken cancellationToken)
    {
        var task = await _taskRepository.GetByIdAsync(request.Id, cancellationToken);
        if (task is null)
            return Result.Failure<TaskResponse>(TaskErrors.NotFound);

        return TaskResponse.FromEntity(task);
    }
}
