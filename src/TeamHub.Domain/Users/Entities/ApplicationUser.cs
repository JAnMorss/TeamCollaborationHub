using Microsoft.AspNetCore.Identity;

namespace TeamHub.Domain.Users.Entities;

public sealed class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
