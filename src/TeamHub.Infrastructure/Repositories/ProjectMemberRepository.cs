using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.ProjectMembers.Entity;
using TeamHub.Domain.ProjectMembers.Enums;
using TeamHub.Domain.ProjectMembers.Interface;

namespace TeamHub.Infrastructure.Repositories;

internal class ProjectMemberRepository : Repository<ProjectMember>, IProjectMemberRepository
{
    public ProjectMemberRepository(ApplicationDbContext context) 
        : base(context)
    {
    }

    public async Task<IEnumerable<ProjectMember>> GetAdminsByProjectAsync(
        Guid projectId, 
        CancellationToken cancellationToken = default)
    {
        return await _context.ProjectMembers
            .Where(pm => pm.ProjectId == projectId && pm.Role == ProjectRole.Admin)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProjectMember>> GetMembersByProjectAsync(
        Guid projectId, 
        CancellationToken cancellationToken = default)
    {
        return await _context.ProjectMembers
            .Include(pm => pm.User)
            .Where(pm => pm.ProjectId == projectId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProjectMember>> GetProjectsByUserAsync(
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        return await _context.ProjectMembers
            .Include(pm => pm.Project)
            .Where(pm => pm.UserId == userId)
            .ToListAsync(cancellationToken);
    }
}
