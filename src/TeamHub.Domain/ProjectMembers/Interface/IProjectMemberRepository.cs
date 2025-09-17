using TeamHub.Domain.ProjectMembers.Entity;

namespace TeamHub.Domain.ProjectMembers.Interface;

public interface IProjectMemberRepository
{
    Task<ProjectMember?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IEnumerable<ProjectMember>> GetMembersByProjectAsync(Guid projectId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProjectMember>> GetProjectsByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProjectMember>> GetAdminsByProjectAsync(Guid projectId, CancellationToken cancellationToken = default);

    Task AddAsync(ProjectMember member, CancellationToken cancellationToken = default);
    Task UpdateAsync(ProjectMember member, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
