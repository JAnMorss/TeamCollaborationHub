using TeamHub.Application.Tasks.Responses;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Tasks.Queries.GetTasksByAssignedUser;

public sealed class GetTasksByAssignedUserQueryHandler : IQueryHandler<GetTasksByAssignedUserQuery, IEnumerable<TaskResponse>>
{
    private readonly ITaskRepository _taskRepository;

    public GetTasksByAssignedUserQueryHandler(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<Result<IEnumerable<TaskResponse>>> Handle(
        GetTasksByAssignedUserQuery request, 
        CancellationToken cancellationToken)
    {
        var tasks = await _taskRepository.GetTasksAssignedToUserAsync(request.UserId, cancellationToken);
        if (tasks is null || !tasks.Any())
            return Result.Success<IEnumerable<TaskResponse>>(Enumerable.Empty<TaskResponse>());

        var mapped = tasks.Select(TaskResponse.FromEntity).ToList();

        return Result.Success<IEnumerable<TaskResponse>>(mapped);
    }
}
