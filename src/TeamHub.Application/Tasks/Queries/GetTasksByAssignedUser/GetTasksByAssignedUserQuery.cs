using TeamHub.Application.Tasks.Responses;
using TeamHub.SharedKernel.Application.Mediator.Query;

namespace TeamHub.Application.Tasks.Queries.GetTasksByAssignedUser;

public sealed record GetTasksByAssignedUserQuery(Guid UserId) : IQuery<IEnumerable<TaskResponse>>;
