using TeamHub.Domain.ProjectMembers.Entity;
using TeamHub.Domain.ProjectMembers.Enums;
using TeamHub.Domain.ProjectMembers.Events;
using TeamHub.Domain.Projects.Errors;
using TeamHub.Domain.Projects.Events;
using TeamHub.Domain.Projects.ValueObjects;
using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.Domain.Projects.Entity;

public sealed class Project : BaseEntity
{
    private readonly List<ProjectMember> _members = new();
    private readonly List<ProjectTask> _tasks = new();

    private Project() { }

    public Project(
        Guid id,
        Guid createdById,
        ProjectName name,
        ProjectDescription description,
        ProjectColor color) : base(id)
    {
        CreatedById = createdById;
        Name = name;
        Description = description;
        Color = color;
        CreatedAt = DateTime.UtcNow;
        IsActive = true;
        IsArchived = false;
    }

    public Guid CreatedById { get; private set; }
    public ProjectName Name { get; private set; } = null!;
    public ProjectDescription Description { get; private set; } = null!;
    public ProjectColor Color { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }
    public bool IsActive { get; private set; }
    public bool IsArchived { get; private set; }

    public User? CreatedBy { get; private set; }
    public IReadOnlyCollection<ProjectMember> Members => _members.AsReadOnly();
    public IReadOnlyCollection<ProjectTask> Tasks => _tasks.AsReadOnly();


    public static Result<Project> Create(
        Guid id,
        Guid createdById,
        string name,
        string description,
        string color)
    {
        var nameResult = ProjectName.Create(name);
        if (nameResult.IsFailure)
            return Result.Failure<Project>(nameResult.Error);

        var descriptionResult = ProjectDescription.Create(description);
        if (descriptionResult.IsFailure)
            return Result.Failure<Project>(descriptionResult.Error);

        var colorResult = ProjectColor.Create(color);
        if (colorResult.IsFailure)
            return Result.Failure<Project>(colorResult.Error);

        var project = new Project(
            id,
            createdById,
            nameResult.Value,
            descriptionResult.Value,
            colorResult.Value);

        project.RaiseDomainEvent(new ProjectCreatedDomainEvent(project.Id));

        return Result.Success(project);
    }

    public Result UpdateDetails(
        string name,
        string description,
        string color)
    {
        bool changed = false;

        if (!string.IsNullOrWhiteSpace(name) && name != Name?.Value)
        {
            var nameResult = ProjectName.Create(name);
            if (nameResult.IsFailure)
                return Result.Failure(nameResult.Error);

            Name = nameResult.Value;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(description) && description != Description?.Value)
        {
            var descriptionResult = ProjectDescription.Create(description);
            if (descriptionResult.IsFailure)
                return Result.Failure(descriptionResult.Error);

            Description = descriptionResult.Value;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(color) && color != Color?.Value)
        {
            var colorResult = ProjectColor.Create(color);
            if (colorResult.IsFailure)
                return Result.Failure(colorResult.Error);

            Color = colorResult.Value;
            changed = true;
        }

        if (!changed)
            return Result.Failure(ProjectErrors.NoChanges);

        RaiseDomainEvent(new ProjectUpdatedDomainEvent(Id));

        return Result.Success(this);
    }

    public Result AddMember(User user, ProjectRole role)
    {
        if (_members.Any(m => m.UserId == user.Id))
        {
            return Result.Failure(ProjectErrors.AlreadyMember);
        }

        var newMember = new ProjectMember(
            Guid.NewGuid(),
            Id,
            user.Id,
            role);

        _members.Add(newMember);

        RaiseDomainEvent(new ProjectMemberAddedDomainEvent(Id, user.Id));

        return Result.Success(newMember);
    }

    public Result RemoveMember(Guid userId)
    {
        var member = _members.FirstOrDefault(m => m.UserId == userId);
        if (member is null)
            return Result.Failure(ProjectErrors.MemberNotFound);

        _members.Remove(member);

        RaiseDomainEvent(new ProjectMemberRemovedDomainEvent(Id, userId));

        return Result.Success();
    }


    public Result Archive()
    {
        if (!IsActive)
            return Result.Failure(ProjectErrors.AlreadyArchived);

        IsActive = false;
        IsArchived = true;
        RaiseDomainEvent(new ProjectArchivedDomainEvent(Id));

        return Result.Success();
    }
}
