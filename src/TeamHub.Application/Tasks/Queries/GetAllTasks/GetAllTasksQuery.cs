using TeamHub.Application.Tasks.Responses;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;

namespace TeamHub.Application.Tasks.Queries.GetAllTasks;

public sealed record GetAllTasksQuery(
    QueryObject? Query,
    Guid UserId) : IQuery<PaginatedResult<TaskResponse>>;
