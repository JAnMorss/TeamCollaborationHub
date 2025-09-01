using TeamHub.Domain.Comments.Entity;
using TeamHub.Domain.Notifications.Entity;
using TeamHub.Domain.ProjectMembers.Entity;
using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Users.Errors;
using TeamHub.Domain.Users.Events;
using TeamHub.Domain.Users.ValueObjects;
using TeamHub.SharedKernel.Domain;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Users.Entities;

public sealed class User : BaseEntity
{
    private User() { }

    public User(
        Guid id,
        FirstName firstName,
        LastName lastName,
        EmailAddress email,
        Avatar avatar,
        PasswordHash passwordHash,
        DateTime? lastLoginAt,
        bool isActive) : base(id)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Avatar = avatar;
        PasswordHash = passwordHash;
        CreatedAt = DateTime.UtcNow;
        IsActive = isActive;
    }

    public FirstName? FirstName { get; private set; }
    public LastName? LastName { get; private set; }
    public EmailAddress? Email { get; private set; }
    public Avatar? Avatar { get; private set; }
    public PasswordHash? PasswordHash { get; private set; }
    public DateTime CreatedAt { get; private set; }   
    public bool IsActive { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public string IdentityId { get; private set; } = string.Empty;

    public ICollection<ProjectMember> ProjectMemberships { get; private set; } = new List<ProjectMember>();
    public ICollection<ProjectTask> AssignedTasks { get; private set; } = new List<ProjectTask>();
    public ICollection<Notification> Notifications { get; private set; } = new List<Notification>();
    public ICollection<Comment> Comments { get; private set; } = new List<Comment>();

    public static Result<User> Create(
        Guid id,
        string firstName,
        string lastName,
        string email,
        string avatar,
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

        var avatarResult = Avatar.Create(avatar);
        if (avatarResult.IsFailure)
            return Result.Failure<User>(UserErrors.AvatarInvalidUrl);

        var passwordResult = PasswordHash.Create(passwordHash);
        if (passwordResult.IsFailure)
            return Result.Failure<User>(passwordResult.Error);

        var user = new User(
            id,
            firstNameResult.Value,
            lastNameResult.Value,
            emailResult.Value,
            avatarResult.Value,
            passwordResult.Value,
            null,
            true);

        user.RaiseDomainEvent(new UserCreatedDomainEvent(user.Id));

        return Result.Success(user);
    }

    public Result<User> Update(
        string firstName,
        string lastName,
        string email,
        string avatar,
        string passwordHash)
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
                return Result.Failure<User>(UserErrors.InvalidEmail);

            Email = emailResult.Value;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(avatar) && avatar != Avatar?.Value)
        {
            var avatarResult = Avatar.Create(avatar);
            if (avatarResult.IsFailure)
                return Result.Failure<User>(UserErrors.AvatarInvalidUrl);

            Avatar = avatarResult.Value;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(passwordHash) && passwordHash != PasswordHash?.Value)
        {
            var passwordResult = PasswordHash.Create(passwordHash);
            if (passwordResult.IsFailure)
                return Result.Failure<User>(passwordResult.Error);

            PasswordHash = passwordResult.Value;
            changed = true;
        }

        if (changed)
        {
            UpdatedAt = DateTime.UtcNow;
            RaiseDomainEvent(new UserUpdatedDomainEvent(Id));
        }

        return Result.Success(this);
    }

    public Result Active()
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
        RaiseDomainEvent(new UserAvatarUpdatedDomainEvent(Id));

        return Result.Success();
    }

    public void SetIdentityId(string identityId)
    {
        IdentityId = identityId;
    }
}
