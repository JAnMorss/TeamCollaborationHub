using TeamHub.Application.Users.Responses;
using TeamHub.SharedKernel.Messaging.Query;

namespace TeamHub.Application.Users.Queries.GetMyProfile;

public sealed record GetMyProfileQuery(Guid UserId) : IQuery<UserResponse>;
