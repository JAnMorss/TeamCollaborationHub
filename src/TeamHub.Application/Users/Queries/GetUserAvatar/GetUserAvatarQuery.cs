using TeamHub.Application.Users.Responses;
using TeamHub.SharedKernel.Application.Mediator.Query;

namespace TeamHub.Application.Users.Queries.GetUserAvatar;

public sealed record GetUserAvatarQuery(Guid UserId) : IQuery<UserAvatarResponse>;
