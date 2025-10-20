using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.ProjectMembers.Entity;
using TeamHub.Domain.ProjectMembers.Enums;
using TeamHub.Domain.ProjectMembers.Interface;
using TeamHub.SharedKernel.Application.Helpers;

namespace TeamHub.Infrastructure.Repositories;

internal class ProjectMemberRepository : Repository<ProjectMember>, IProjectMemberRepository
{
    public ProjectMemberRepository(ApplicationDbContext context) 
        : base(context)
    {
    }

    public override async Task<IEnumerable<ProjectMember>> GetAllAsync(
        QueryObject query,
        CancellationToken cancellationToken = default)
    {
        var projectMembers = _context.ProjectMembers
            .Include(pm => pm.User)
            .AsQueryable();

        projectMembers = query.SortBy?.ToLower() switch
        {
            "fullname" => query.Descending
                ? projectMembers.OrderByDescending(pm => pm.User.FirstName.Value)
                                .ThenByDescending(pm => pm.User.LastName.Value)
                : projectMembers.OrderBy(pm => pm.User.FirstName.Value)
                                .ThenBy(pm => pm.User.LastName.Value),

            "role" => query.Descending
                ? projectMembers.OrderByDescending(pm => pm.Role)
                : projectMembers.OrderBy(pm => pm.Role),

            _ => query.Descending
                ? projectMembers.OrderByDescending(pm => pm.JoinedAt)
                : projectMembers.OrderBy(pm => pm.JoinedAt)
        };

        var page = query.Page <= 0 ? 1 : query.Page;
        var pageSize = query.PageSize <= 0 ? 10 : query.PageSize;
        var skip = (page - 1) * pageSize;

        return await projectMembers
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }


    public async Task<ProjectMember?> FindAsync(
        Guid projectId, 
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        return await _context.ProjectMembers
            .FirstOrDefaultAsync(m => m.ProjectId == projectId && m.UserId == userId, cancellationToken);
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

    public async Task<IEnumerable<ProjectMember>> GetAllByProjectIdAsync(
    Guid projectId,
    QueryObject query,
    CancellationToken cancellationToken = default)
    {
        var projectMembers = _context.ProjectMembers
            .Include(pm => pm.User)
            .Where(pm => pm.ProjectId == projectId)
            .AsQueryable();

        projectMembers = query.SortBy?.ToLower() switch
        {
            "fullname" => query.Descending
                ? projectMembers.OrderByDescending(pm => pm.User.FirstName.Value)
                                .ThenByDescending(pm => pm.User.LastName.Value)
                : projectMembers.OrderBy(pm => pm.User.FirstName.Value)
                                .ThenBy(pm => pm.User.LastName.Value),

            "role" => query.Descending
                ? projectMembers.OrderByDescending(pm => pm.Role)
                : projectMembers.OrderBy(pm => pm.Role),

            _ => query.Descending
                ? projectMembers.OrderByDescending(pm => pm.JoinedAt)
                : projectMembers.OrderBy(pm => pm.JoinedAt)
        };

        var page = query.Page <= 0 ? 1 : query.Page;
        var pageSize = query.PageSize <= 0 ? 10 : query.PageSize;
        var skip = (page - 1) * pageSize;

        return await projectMembers
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<ProjectMember?> GetByProjectAndUserIdAsync(
        Guid projectId, 
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        return await _context.ProjectMembers
            .Include(pm => pm.User)
            .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == userId, cancellationToken);
    }
}
