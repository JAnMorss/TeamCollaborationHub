using TeamHub.Application.Tasks.Responses;
using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.Application.Tasks.Queries.GetAllTasks;

public sealed class GetAllTasksQueryHandler 
    : IQueryHandler<GetAllTasksQuery, PaginatedResult<TaskResponse>>
{
    private readonly ITaskRepository _taskRepository;

    public GetAllTasksQueryHandler(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<Result<PaginatedResult<TaskResponse>>> Handle(
        GetAllTasksQuery request, 
        CancellationToken cancellationToken)
    {
        var query = request.Query ?? new QueryObject();

        var tasks = await _taskRepository.GetAllAsync(query, cancellationToken);
        if (tasks is null)
            return Result.Failure<PaginatedResult<TaskResponse>>(TaskErrors.NotFound);

        var mapped = tasks
            .Select(TaskResponse.FromEntity)
            .ToList();

        var totalCount = await _taskRepository.CountAsync(cancellationToken);

        var result = new PaginatedResult<TaskResponse>(
            mapped,
            totalCount,
            query.Page,
            query.PageSize);

        return Result.Success(result);
    }
}
