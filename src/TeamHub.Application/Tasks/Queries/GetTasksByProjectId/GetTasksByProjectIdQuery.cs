using TeamHub.Application.Tasks.Responses;
using TeamHub.SharedKernel.Application.Mediator.Query;

namespace TeamHub.Application.Tasks.Queries.GetTasksByProjectId;

public sealed record GetTasksByProjectIdQuery(Guid ProjectId) : IQuery<IEnumerable<TaskResponse>>;