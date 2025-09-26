using TeamHub.Domain.ProjectMembers.Entity;

namespace TeamHub.Application.Projects.Responses;

public sealed class ProjectMemberResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? FullName { get; set; }
    public string Role { get; set; } = string.Empty;
    public DateTime JoinedAt { get; set; }

    public static ProjectMemberResponse FromEntity(ProjectMember member)
    {
        return new ProjectMemberResponse
        {
            Id = member.Id,
            UserId = member.UserId,
            FullName = member.User is not null
                ? $"{member.User.FirstName.Value} {member.User.LastName.Value}"
                : null,
            Role = member.Role.ToString(),
            JoinedAt = member.JoinedAt
        };
    }
}