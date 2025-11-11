using TeamHub.Application.Users.Responses;
using TeamHub.Domain.Users.Interface;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Users.Queries.SearchUsersByName;

public sealed class SearchUsersByNameQueryHandler : IQueryHandler<SearchUsersByNameQuery, PaginatedResult<UserResponse>>
{
    private readonly IUserRepository _userRepository;
    public SearchUsersByNameQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    public async Task<Result<PaginatedResult<UserResponse>>> Handle(SearchUsersByNameQuery request, CancellationToken cancellationToken)
    {
        var query = request.Query ?? new QueryObject();

        var users = await _userRepository.SearchUsersByNameAsync(
            request.Name, 
            query, 
            cancellationToken);

        var mapped = users.Select(UserResponse.FromEntity).ToList();
        var totalCount = users.Count();

        var result = new PaginatedResult<UserResponse>(
            mapped,
            totalCount,
            query.Page,
            query.PageSize);

        return Result.Success(result);
    }
}
