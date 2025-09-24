using TeamHub.Domain.Projects.Entity;

namespace TeamHub.Application.Projects.Responses;

public sealed class ProjectResponse
{
    public Guid Id { get; set; }
    public Guid CreatedById { get; set; }
    public string? CreatedBy { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public bool IsActive { get; set; }
    public bool IsArchived { get; set; }

    public object Members { get; set; } = new();

    public static ProjectResponse FromEntity(Project project)
    {
        var response = new ProjectResponse
        {
            Id = project.Id,
            Name = project.Name.Value,
            Description = project.Description.Value,
            Color = project.Color.Value,
            IsActive = project.IsActive,
            IsArchived = project.IsArchived,
            CreatedById = project.CreatedById,
            CreatedBy = project.CreatedBy is not null
                        ? $"{project.CreatedBy.FirstName.Value} {project.CreatedBy.LastName.Value}"
                        : null
        };

        response.Members = project.Members is null || !project.Members.Any()
            ? "No members yet. Please add a member."
            : project.Members
                .Select(ProjectMemberResponse.FromEntity)
                .ToList();

        return response;
    }
}
