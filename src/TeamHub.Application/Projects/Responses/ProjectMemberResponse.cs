using TeamHub.Domain.ProjectMembers.Entity;

namespace TeamHub.Application.Projects.Responses;

public sealed class ProjectMemberResponse
{
    public Guid UserId { get; set; }
    public string? FullName { get; set; }
    public string Role { get; set; } = null!;
    public DateTime JoinedAt { get; set; }

    public static ProjectMemberResponse FromEntity(ProjectMember member)
    {
        return new ProjectMemberResponse
        {
            UserId = member.UserId,
            FullName = member.User != null
                ? $"{member.User.FirstName.Value} {member.User.LastName.Value}"
                : null,
            Role = member.Role.ToString(),
            JoinedAt = member.JoinedAt
        };
    }
}