using TeamHub.Application.Users.Responses;
using TeamHub.Domain.Projects.Entity;

namespace TeamHub.Application.Projects.Responses;

public sealed class ProjectResponse
{
    public Guid Id { get; set; }

    public Guid CreatedById { get; set; }

    public UserResponse? CreatedBy { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? Color { get; set; }


    public static ProjectResponse FromEntity(Project project)
    {
        return new ProjectResponse
        {
            Id = project.Id,
            Name = project.Name.Value,
            Description = project.Description.Value,
            Color = project.Color.Value,
            CreatedById = project.CreatedById,
            CreatedBy = project.CreatedBy is not null
                ? new UserResponse
                {
                    FullName = $"{project.CreatedBy.FirstName.Value} {project.CreatedBy.LastName.Value}",
                    Email = project.CreatedBy.Email.Value
                }
                : null
        };
    }
}
