using TeamHub.Application.Users.Responses;
using TeamHub.Domain.Users.Errors;
using TeamHub.Domain.Users.Interface;
using TeamHub.Domain.Users.ValueObjects;
using TeamHub.SharedKernel.Application.Mediator.Query;
using TeamHub.SharedKernel.ErrorHandling;
using TeamHub.SharedKernel.Storage;

namespace TeamHub.Application.Users.Queries.GetUserAvatar;

public sealed class GetUserAvatarQueryHandler : IQueryHandler<GetUserAvatarQuery, UserAvatarResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IAvatarBlobService _avatarBlobService;

    public GetUserAvatarQueryHandler(
        IUserRepository userRepository, 
        IAvatarBlobService avatarBlobService)
    {
        _userRepository = userRepository;
        _avatarBlobService = avatarBlobService;
    }

    public async Task<Result<UserAvatarResponse>> Handle(
        GetUserAvatarQuery request, 
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
            return Result.Failure<UserAvatarResponse>(UserErrors.NotFound);

        if (user.Avatar is null || string.IsNullOrWhiteSpace(user.Avatar.Value))
            return Result.Failure<UserAvatarResponse>(UserErrors.AvatarNotFound);

        var fileId = Avatar.ExtractFileIdFromUrl(user.Avatar.Value);
        if (!fileId.HasValue)
            return Result.Failure<UserAvatarResponse>(UserErrors.InvalidAvatar);

        var downloadResult = await _avatarBlobService.DownloadAsync(fileId.Value, cancellationToken);
        if (downloadResult is null)
            return Result.Failure<UserAvatarResponse>(UserErrors.AvatarNotFound);

        using var memoryStream = new MemoryStream();
        await downloadResult.Stream.CopyToAsync(memoryStream, cancellationToken);

        var imageBytes = memoryStream.ToArray();

        var response = UserAvatarResponse.FromEntity(user, imageBytes, downloadResult.ContentType);

        return Result.Success(response);
    }
}
