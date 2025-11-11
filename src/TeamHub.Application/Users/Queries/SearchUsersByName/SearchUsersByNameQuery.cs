using TeamHub.Application.Users.Responses;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;

namespace TeamHub.Application.Users.Queries.SearchUsersByName;

public sealed record SearchUsersByNameQuery(
    string Name,
    QueryObject Query) : IQuery<PaginatedResult<UserResponse>>;
