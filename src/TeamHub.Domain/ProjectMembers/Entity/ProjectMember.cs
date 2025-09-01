using TeamHub.Domain.ProjectMembers.Enums;
using TeamHub.Domain.ProjectMembers.Events;
using TeamHub.Domain.Projects.Entity;
using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.ProjectMembers.Entity;

public sealed class ProjectMember : BaseEntity
{
    private ProjectMember() { }
    public ProjectMember(
        Guid id,
        Guid projectId,
        Guid userId,
        ProjectRole role,
        DateTime joinedAt) : base(id)
    {
        ProjectId = projectId;
        UserId = userId;
        Role = role;
        JoinedAt = DateTime.UtcNow;
    }


    public Guid ProjectId { get; private set; }
    public Guid UserId { get; private set; }
    public ProjectRole Role { get; private set; }
    public DateTime JoinedAt { get; private set; }

    public Project? Project { get; private set; }
    public User? User { get; private set; }

    public void ChangeRole(ProjectRole newRole)
    {
        if (Role == newRole) return;

        Role = newRole;
        RaiseDomainEvent(new ProjectMemberRoleChangedDomainEvent(Id, newRole));
    }
}
