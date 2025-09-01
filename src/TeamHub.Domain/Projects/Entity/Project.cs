using TeamHub.Domain.ProjectMembers.Entity;
using TeamHub.Domain.Projects.ValueObjects;
using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Projects.Entity;

public sealed class Project : BaseEntity
{
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
    }

    public Guid CreatedById { get; private set; }
    public ProjectName? Name { get; private set; }
    public ProjectDescription? Description { get; private set; }
    public ProjectColor? Color { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public bool IsActive { get; private set; }

    public User? CreatedBy { get; private set; }
    public ICollection<ProjectMember>? Members { get; set; }
    public ICollection<ProjectTask>? Tasks { get; private set; }
}
