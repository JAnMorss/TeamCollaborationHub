using TeamHub.Domain.ProjectMembers.Entity;
using TeamHub.SharedKernel.Domain.Repositories;

namespace TeamHub.Domain.ProjectMembers.Interface;

public interface IProjectMemberRepository : IRepository<ProjectMember>
{
    Task<ProjectMember?> FindAsync(Guid projectId, Guid userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<ProjectMember>> GetMembersByProjectAsync(Guid projectId, CancellationToken cancellationToken = default);

    Task<IEnumerable<ProjectMember>> GetProjectsByUserAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<ProjectMember>> GetAdminsByProjectAsync(Guid projectId, CancellationToken cancellationToken = default);
}
