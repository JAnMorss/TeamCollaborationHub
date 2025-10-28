using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.Projects.Entity;
using TeamHub.Domain.Projects.Interface;
using TeamHub.SharedKernel.Application.Helpers;

namespace TeamHub.Infrastructure.Repositories;

internal class ProjectRepository : Repository<Project>, IProjectRepository
{
    public ProjectRepository(ApplicationDbContext context) 
        : base(context)
    {
    }

    public override async Task<IEnumerable<Project>> GetAllAsync(
        QueryObject query,
        CancellationToken cancellationToken = default)
    {
        var project = _context.Projects
            .Include(p => p.Members)
                .ThenInclude(m => m.User)
            .Include(p => p.Tasks)
            .Include(p => p.CreatedBy)
            .AsQueryable();

        project = query.SortBy?.ToLower() switch
        {
            "name" => query.Descending
                      ? project.OrderByDescending(p => p.Name.Value)
                      : project.OrderBy(p => p.Name.Value),
            _ => project.OrderBy(p => p.CreatedAt) 
        };

        var page = query.Page <= 0 ? 1 : query.Page;
        var pageSize = query.PageSize <= 0 ? 10 : query.PageSize;

        var skip = (page - 1) * pageSize;

        return await project
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Project>> GetAllByUserAsync(
        QueryObject query, 
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        var projects = _context.Projects
            .Include(p => p.Members)
                .ThenInclude(m => m.User)
            .Include(p => p.Tasks)
            .Include(p => p.CreatedBy)
            .AsQueryable();

        projects = projects.Where(p =>
            p.CreatedById == userId |
            p.Members.Any(m => m.UserId == userId)
        );

        projects = query.SortBy?.ToLower() switch
        {
            "name" => query.Descending
                      ? projects.OrderByDescending(p => p.Name.Value)
                      : projects.OrderBy(p => p.Name.Value),
            _ => projects.OrderBy(p => p.CreatedAt)
        };

        var page = query.Page <= 0 ? 1 : query.Page;
        var pageSize = query.PageSize <= 0 ? 10 : query.PageSize;

        var skip = (page - 1) * pageSize;

        return await projects
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }


    public override async Task<Project?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .Include(p => p.Members)
            .Include(p => p.Tasks)
            .Include(p => p.CreatedBy)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Project>> GetArchivedProjectsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .Where(p => p.IsArchived)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Project>> GetProjectsOwnedByUserAsync(
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .Where(p => p.CreatedById == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Project>> SearchProjectsByNameAsync(
        string name, 
        QueryObject query, 
        CancellationToken cancellationToken = default)
    {
        var projects = _context.Projects
            .Include(p => p.Members)
                .ThenInclude(m => m.User)
            .Include(p => p.Tasks)
            .Include(p => p.CreatedBy).AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
        {
            projects = projects.Where(p => p.Name.Value.Contains(name));
        }

        var validSortColumns = new[]
        {
            "Name",
            "CreatedAt",
            "UpdatedAt"
        };

        if (!string.IsNullOrWhiteSpace(query.SortBy) && validSortColumns.Contains(query.SortBy))
        {
            projects = query.Descending
                ? projects.OrderByDescending(e => EF.Property<object>(e, query.SortBy))
                : projects.OrderBy(e => EF.Property<object>(e, query.SortBy));
        }
        else
        {
            projects = projects.OrderBy(p => p.CreatedAt);
        }

        var skip = (query.Page - 1) * query.PageSize;
        return await projects
            .Skip(skip)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);
    }

}
