using TeamHub.Application.Users.Responses;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;

namespace TeamHub.Application.Users.Queries.GetAllUsers;

public sealed record GetAllUsersQuery(QueryObject? Query) : IQuery<PaginatedResult<UserResponse>>;
