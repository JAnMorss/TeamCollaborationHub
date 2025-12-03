using TeamHub.Domain.Users.Entities;
using TeamHub.Domain.Users.ValueObjects;

namespace TeamHub.DomainUnitTests.Users;

internal static class UserData
{
    public static User Create() => User.Create(
        Guid.NewGuid(),
        FirstName.Value,
        LastName.Value,
        Email.Value,
        Avatar.Value,
        PasswordHash.Value).Value;

    public static readonly FirstName FirstName =
        FirstName.Create("John Anthony").Value;

    public static readonly LastName LastName =
        LastName.Create("Morales").Value;

    public static readonly EmailAddress Email =
        EmailAddress.Create("Janmors13@gmail.com").Value;

    public static readonly Avatar Avatar =
        Avatar.Create("https://example.com/avatar.jpg").Value;

    public static readonly PasswordHash PasswordHash =
        PasswordHash.Create("p@ssw0rd").Value;
}

