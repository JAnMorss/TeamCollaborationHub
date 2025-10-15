using TeamHub.Application.Tasks.Responses;
using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Tasks.Queries.GetTasksByProjectId;

public sealed class GetTasksByProjectIdQueryHandler
    : IQueryHandler<GetTasksByProjectIdQuery, IEnumerable<TaskResponse>>
{
    private readonly ITaskRepository _taskRepository;

    public GetTasksByProjectIdQueryHandler(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<Result<IEnumerable<TaskResponse>>> Handle(
        GetTasksByProjectIdQuery request, 
        CancellationToken cancellationToken)
    {
        var tasks = await _taskRepository.GetTasksByProjectIdAsync(request.ProjectId, cancellationToken);
        if (tasks is null || !tasks.Any())
            return Result.Success<IEnumerable<TaskResponse>>(Enumerable.Empty<TaskResponse>());

        var mapped = tasks.Select(TaskResponse.FromEntity).ToList();

        return Result.Success<IEnumerable<TaskResponse>>(mapped);
    }
}
