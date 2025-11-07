using TeamHub.Application.Users.Responses;
using TeamHub.Domain.Users.Errors;
using TeamHub.Domain.Users.Interface;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.Application.PageSize;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Users.Queries.GetAllUsers;

public sealed class GetAllUsersQueryHandler : IQueryHandler<GetAllUsersQuery, PaginatedResult<UserResponse>>
{
    private readonly IUserRepository _userRepository;

    public GetAllUsersQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<PaginatedResult<UserResponse>>> Handle(
        GetAllUsersQuery request, 
        CancellationToken cancellationToken)
    {
        var query = request.Query ?? new QueryObject();
        
        var users = await _userRepository.GetAllAsync(query, cancellationToken);
        if (users is null)
            return Result.Failure<PaginatedResult<UserResponse>>(UserErrors.NotFound);

        var mapped = users
            .Select(UserResponse.FromEntity)
            .ToList();

        var totalCount = await _userRepository.CountAsync(cancellationToken);

        var result = new PaginatedResult<UserResponse>(
            mapped,
            totalCount,
            query.Page,
            query.PageSize);

        return Result.Success(result);
    }
}
