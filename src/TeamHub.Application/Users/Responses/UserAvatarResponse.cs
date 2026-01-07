using TeamHub.Domain.Users.Entities;

namespace TeamHub.Application.Users.Responses;

public sealed class UserAvatarResponse
{
    public string? AvatarUrl { get; init; } = string.Empty;

    public byte[]? ImageBytes { get; init; }

    public string? ContentType { get; init; }

    public static UserAvatarResponse FromEntity(
        User user,
        byte[]? imageBytes = null, 
        string? contentType = null)
    {
        return new UserAvatarResponse
        {
            AvatarUrl = user.Avatar?.Value,
            ImageBytes = imageBytes,
            ContentType = contentType
        };
    }
}