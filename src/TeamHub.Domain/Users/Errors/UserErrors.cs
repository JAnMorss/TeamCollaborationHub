using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Users.Errors;

public static class UserErrors
{
    public static readonly Error NotFound = new(
        "User.NotFound",
        "The user with the specified identifier was not found.");

    public static readonly Error InvalidEmail = new(
        "User.InvalidEmail",
        "The user's email address is invalid.");

    public static readonly Error AvatarInvalidUrl = new(
        "User.AvatarInvalidUrl",
        "The avatar URL must be a valid HTTP or HTTPS address.");

    public static readonly Error AlreadyActive = new(
        "User.AlreadyActive",
        "The user is already active.");

    public static readonly Error AlreadyInactive = new(
        "User.AlreadyInactive",
        "The user is already inactive.");
}