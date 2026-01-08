using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.Projects.Entity;
using TeamHub.Domain.Projects.Interface;
using TeamHub.Infrastructure.Repositories.Base;
using TeamHub.SharedKernel.Application.Helpers;

namespace TeamHub.Infrastructure.Repositories;

internal sealed class ProjectRepository : UserOwnedRepository<Project>, IProjectRepository
{
    public ProjectRepository(ApplicationDbContext context)
        : base(context, new ProjectQueryHooks())
    {
    }

    protected override IQueryable<Project> VisibleToUser(IQueryable<Project> query, Guid userId)
    {
        return query.Where(p =>
            p.CreatedById == userId ||
            p.Members.Any(m => m.UserId == userId)
        );
    }

    public override async Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await BuildQuery(_context, new QueryObject())
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Project>> GetArchivedProjectsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .Where(p => p.IsArchived)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Project>> GetProjectsOwnedByUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .Where(p => p.CreatedById == userId)
            .ToListAsync(cancellationToken);
    }
}

public sealed class ProjectQueryHooks : QueryHooks<Project>
{
    public override IQueryable<Project> BuildQuery(ApplicationDbContext context, QueryObject query)
    {
        return context.Projects
            .Include(p => p.Members)
                .ThenInclude(m => m.User)
            .Include(p => p.Tasks)
            .Include(p => p.CreatedBy)
            .AsQueryable();
    }

    public override IQueryable<Project> ApplyFilters(IQueryable<Project> query, SearchQueryObject searchQueryObject, Guid? userId = null)
    {
        if (!string.IsNullOrWhiteSpace(searchQueryObject.Search))
        {
            query = query.Where(p => p.Name.Value.Contains(searchQueryObject.Search));
        }
        return query;
    }

    public override IQueryable<Project> ApplySorting(IQueryable<Project> query, QueryObject queryObject)
    {
        if (string.IsNullOrWhiteSpace(queryObject.SortBy))
            return query.OrderBy(p => p.CreatedAt);

        return queryObject.SortBy.ToLower() switch
        {
            "name" => queryObject.Descending
                ? query.OrderByDescending(p => p.Name.Value)
                : query.OrderBy(p => p.Name.Value),

            "createdat" => queryObject.Descending
                ? query.OrderByDescending(p => p.CreatedAt)
                : query.OrderBy(p => p.CreatedAt),

            "updatedat" => queryObject.Descending
                ? query.OrderByDescending(p => p.UpdatedAt)
                : query.OrderBy(p => p.UpdatedAt),

            _ => query.OrderBy(p => p.CreatedAt)
        };
    }
}
