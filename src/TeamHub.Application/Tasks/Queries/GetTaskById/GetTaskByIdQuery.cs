using TeamHub.Application.Tasks.Responses;
using TeamHub.SharedKernel.Application.Mediator.Query;

namespace TeamHub.Application.Tasks.Queries.GetTaskById;

public sealed record GetTaskByIdQuery(Guid Id) : IQuery<TaskResponse>;
