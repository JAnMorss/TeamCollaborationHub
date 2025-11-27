using TeamHub.Domain.Notifications.Entity;
using TeamHub.Domain.ProjectMembers.Entity;
using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Users.Enums;
using TeamHub.Domain.Users.Errors;
using TeamHub.Domain.Users.Events;
using TeamHub.Domain.Users.ValueObjects;
using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Users.Entities;

public sealed class User : BaseEntity
{
    private readonly List<ProjectMember> _projectMemberships = new();
    private readonly List<ProjectTask> _assignedTasks = new();
    private readonly List<Notification> _notifications = new();
    private readonly List<RefreshToken> _refreshTokens = new();

    private User() { }

    public User(
        Guid id,
        string identityId,
        FirstName firstName,
        LastName lastName,
        EmailAddress email,
        Avatar? avatar,
        PasswordHash passwordHash,
        bool isActive) : base(id)
    {
        IdentityId = identityId;
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Avatar = avatar;
        PasswordHash = passwordHash;
        CreatedAt = DateTime.UtcNow;
        IsActive = isActive;
        UpdatedAt = null;
    }


    public FirstName FirstName { get; private set; } = null!;
    public LastName LastName { get; private set; } = null!;
    public UserRole Role { get; private set; } = UserRole.User;
    public EmailAddress Email { get; private set; } = null!;
    public Avatar? Avatar { get; private set; }
    public PasswordHash PasswordHash { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public string? IdentityId { get; private set; }

    public IReadOnlyCollection<ProjectMember> ProjectMemberships
        => _projectMemberships.AsReadOnly();
    public IReadOnlyCollection<ProjectTask> AssignedTasks
        => _assignedTasks.AsReadOnly();
    public IReadOnlyCollection<Notification> Notifications
        => _notifications.AsReadOnly();
    public IReadOnlyCollection<RefreshToken> RefreshTokens
        => _refreshTokens.AsReadOnly();

    public static Result<User> Create(
        Guid id,
        string firstName,
        string lastName,
        string email,
        string? avatar,
        string passwordHash)
    {
        var firstNameVo = ResultHelper.CreateOrFail(FirstName.Create, firstName);
        var lastNameVo = ResultHelper.CreateOrFail(LastName.Create, lastName);
        var emailVo = ResultHelper.CreateOrFail(EmailAddress.Create, email);
        var passwordVo = ResultHelper.CreateOrFail(PasswordHash.Create, passwordHash);

        Avatar? avatarVo = null;
        if (!string.IsNullOrWhiteSpace(avatar))
            avatarVo = ResultHelper.CreateOrFail(Avatar.Create, avatar);

        var user = new User(
            id,
            Guid.NewGuid().ToString(),
            firstNameVo,
            lastNameVo,
            emailVo,
            avatarVo,
            passwordVo,
            true);

        user.RaiseDomainEvent(new UserCreatedDomainEvent(user.Id));

        return Result.Success(user);
    }

    public Result<User> UpdateDetails(
        string firstName,
        string lastName,
        string email)
    {
        bool changed = false;

        if (!string.IsNullOrWhiteSpace(firstName) && firstName != FirstName?.Value)
        {
            var firstNameResult = ResultHelper.CreateOrFail(FirstName.Create, firstName);

            FirstName = firstNameResult;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(lastName) && lastName != LastName?.Value)
        {
            var lastNameResult = ResultHelper.CreateOrFail(LastName.Create, lastName);

            LastName = lastNameResult;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(email) && email != Email?.Value)
        {
            var emailResult = ResultHelper.CreateOrFail(EmailAddress.Create, email);

            Email = emailResult;
            changed = true;
        }

        if (changed)
        {
            UpdatedAt = DateTime.UtcNow;
            RaiseDomainEvent(new UserUpdatedDomainEvent(Id));
        }

        return Result.Success(this);
    }

    public Result Activate()
    {
        if (IsActive)
            return Result.Failure(UserErrors.AlreadyActive);

        IsActive = true;

        RaiseDomainEvent(new UserActivatedDomainEvent(Id));
        return Result.Success();
    }

    public Result Deactivate()
    {
        if (!IsActive)
            return Result.Failure(UserErrors.AlreadyInactive);

        IsActive = false;

        RaiseDomainEvent(new UserDeactiveDomainEvent(Id));
        return Result.Success();
    }

    public Result UpdateAvatar(string avatarUrl)
    {
        var result = Avatar.Create(avatarUrl);
        if (result.IsFailure)
            return Result.Failure(UserErrors.AvatarInvalidUrl);

        Avatar = result.Value;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new UserAvatarUpdatedDomainEvent(Id));

        return Result.Success();
    }

    public void SetIdentityId(string identityId)
        => IdentityId = identityId;

    public Result PromoteToAdmin()
    {
        if (Role == UserRole.Admin)
            return Result.Failure(UserErrors.AlreadyAdmin);

        Role = UserRole.Admin;
        RaiseDomainEvent(new UserPromotedToAdminDomainEvent(Id));

        return Result.Success();
    }

    public Result DemoteToUser()
    {
        if (Role == UserRole.User)
            return Result.Failure(UserErrors.AlreadyUser);

        Role = UserRole.User;
        RaiseDomainEvent(new UserDemotedToUserDomainEvent(Id));

        return Result.Success();
    }

    public void AddRefreshToken(RefreshToken refreshToken)
    {
        _refreshTokens.Add(refreshToken);
    }

    public Result ChangePassword(string newPasswordHash)
    {
        var passwordResult = PasswordHash.Create(newPasswordHash);
        if (passwordResult.IsFailure)
            return Result.Failure(UserErrors.InvalidPassword);

        PasswordHash = passwordResult.Value;

        RaiseDomainEvent(new UserPasswordChangedDomainEvent(Id));
        return Result.Success();
    }
}