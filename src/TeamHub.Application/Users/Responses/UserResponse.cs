using System.ComponentModel.DataAnnotations;
using TeamHub.Domain.Users.Entities;

namespace TeamHub.Application.Users.Responses;

public sealed class UserResponse
{
    public Guid Id { get; init; }

    public string? FullName { get; init; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    [EmailAddress]
    public string? Email { get; init; }

    public string? Avatar { get; init; } = string.Empty;

    public bool IsActive { get; init; }

    public DateTime? UpdatedAt { get; set; }

    public string? IdentityId { get; init; }


    public static UserResponse FromEntity(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            FullName = $"{user.FirstName.Value} {user.LastName.Value}",
            Role = user.Role.ToString(),
            Email = user.Email?.Value,
            Avatar = user.Avatar?.Value,
            IsActive = user.IsActive,
            UpdatedAt = user.UpdatedAt,
            IdentityId = user.IdentityId
        };
    }
}
