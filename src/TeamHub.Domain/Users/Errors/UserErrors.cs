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

    public static readonly Error InvalidCredentials = new(
        "User.InvalidCredentials",
        "The provided credentials are incorrect.");

    public static readonly Error AlreadyAdmin = new(
        "User.AlreadyAdmin",
        "The user is already an admin.");

    public static readonly Error AlreadyUser = new(
        "User.AlreadyUser",
        "The user is already a regular user.");

    public static readonly Error AvatarNotFound = new(
        "User.AvatarNotFound",
        "The user does not have an avatar set.");

    public static readonly Error InvalidAvatar = new(
        "User.InvalidAvatar",
        "The user's avatar is invalid.");

    public static readonly Error InvalidResetRequest = new(
        "User.InvalidResetRequest",
        "The user's reset request is invalid.");

    public static readonly Error InvalidResetToken = new(
        "User.InvalidResetToken",
        "The user's reset token is invalid.");

    public static readonly Error InvalidPassword = new(
        "User.InvalidPassword",
        "The provided password does not meet the required criteria.");

}