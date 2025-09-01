using System.ComponentModel.DataAnnotations;
using TeamHub.Domain.Users.Entities;

namespace TeamHub.Application.Users.Responses;

public sealed class UserResponse
{
    public string? FirstName { get; init; } = string.Empty;

    public string? LastName { get; init; } = string.Empty;

    [EmailAddress]
    public string? Email { get; init; }

    public string? Avatar { get; init; } = string.Empty;

    public bool IsActive { get; init; }


    public static UserResponse FromEntity(User user)
    {
        return new UserResponse
        {
            FirstName = user.FirstName?.Value,
            LastName = user.LastName?.Value,
            Email = user.Email?.Value,
            Avatar = user.Avatar?.Value,
            IsActive = user.IsActive
        };
    }
}
