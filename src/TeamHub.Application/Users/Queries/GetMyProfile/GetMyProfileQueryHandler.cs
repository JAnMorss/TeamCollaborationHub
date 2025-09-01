using TeamHub.Application.Users.Responses;
using TeamHub.Domain.Users.Errors;
using TeamHub.Domain.Users.Interface;
using TeamHub.SharedKernel.ErrorHandling;
using TeamHub.SharedKernel.Messaging.Query;

namespace TeamHub.Application.Users.Queries.GetMyProfile;

public sealed class GetMyProfileQueryHandler
    : IQueryHandler<GetMyProfileQuery, UserResponse>
{
    private readonly IUserRepository _userRepository;

    public GetMyProfileQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<UserResponse>> Handle(GetMyProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
            return Result.Failure<UserResponse>(UserErrors.NotFound);

        return Result.Success(UserResponse.FromEntity(user));
    }
}
