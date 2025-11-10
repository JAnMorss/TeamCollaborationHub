using TeamHub.Domain.Comments.Entity;
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
    private readonly List<Comment> _comments = new();
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
    public IReadOnlyCollection<Comment> Comments 
        => _comments.AsReadOnly();
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
        var firstNameResult = FirstName.Create(firstName);
        if (firstNameResult.IsFailure)
            return Result.Failure<User>(firstNameResult.Error);

        var lastNameResult = LastName.Create(lastName);
        if (lastNameResult.IsFailure)
            return Result.Failure<User>(lastNameResult.Error);

        var emailResult = EmailAddress.Create(email);
        if (emailResult.IsFailure)
            return Result.Failure<User>(UserErrors.InvalidEmail);

        Avatar? avatarValue = null;
        if (!string.IsNullOrWhiteSpace(avatar))
        {
            var avatarResult = Avatar.Create(avatar);
            if (avatarResult.IsFailure)
                return Result.Failure<User>(UserErrors.AvatarInvalidUrl);

            avatarValue = avatarResult.Value;
        }

        var passwordResult = PasswordHash.Create(passwordHash);
        if (passwordResult.IsFailure)
            return Result.Failure<User>(passwordResult.Error);

        var user = new User(
            id,
            Guid.NewGuid().ToString(),
            firstNameResult.Value,
            lastNameResult.Value,
            emailResult.Value,
            avatarValue,
            passwordResult.Value,
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
            var firstNameResult = FirstName.Create(firstName);
            if (firstNameResult.IsFailure)
                return Result.Failure<User>(firstNameResult.Error);

            FirstName = firstNameResult.Value;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(lastName) && lastName != LastName?.Value)
        {
            var lastNameResult = LastName.Create(lastName);
            if (lastNameResult.IsFailure)
                return Result.Failure<User>(lastNameResult.Error);

            LastName = lastNameResult.Value;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(email) && email != Email?.Value)
        {
            var emailResult = EmailAddress.Create(email);
            if (emailResult.IsFailure)
                return Result.Failure<User>(emailResult.Error);

            Email = emailResult.Value;
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
}
