using TeamHub.Domain.Users.ValueObjects;

namespace TeamHub.DomainUnitTests.Users;

internal static class UserData
{
    public static readonly FirstName FirstName = 
        FirstName.Create("John Anthony").Value; 

    public static readonly LastName LastName = 
        LastName.Create("Morales").Value;

    public static readonly EmailAddress Email = 
        EmailAddress.Create("Janmors13@gmail.com").Value;

    public static readonly Avatar Avatar = 
        Avatar.Create("https://example.com/avatar.jpg").Value;

    public static readonly PasswordHash passwordHash = 
        PasswordHash.Create("p@ssw0rd").Value;
}

