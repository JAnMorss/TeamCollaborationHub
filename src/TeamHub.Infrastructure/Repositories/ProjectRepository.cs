using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.Projects.Entity;
using TeamHub.Domain.Projects.Interface;
using TeamHub.Infrastructure.Repositories.Base;
using TeamHub.SharedKernel.Application.Helpers;

namespace TeamHub.Infrastructure.Repositories;

internal sealed class ProjectRepository : UserOwnedRepository<Project>, IProjectRepository
{
    public ProjectRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    protected override IQueryable<Project> BuildQuery(
        ApplicationDbContext context,
        QueryObject query)
    {
        return context.Projects
            .Include(p => p.Members)
                .ThenInclude(m => m.User)
            .Include(p => p.Tasks)
            .Include(p => p.CreatedBy)
            .AsQueryable();
    }


    protected override IQueryable<Project> ApplyFilters(
        IQueryable<Project> query,
        SearchQueryObject searchQueryObject,
        Guid? userId = null)
    {
        if (!string.IsNullOrWhiteSpace(searchQueryObject.Search))
        {
            query = query.Where(p => p.Name.Value.Contains(searchQueryObject.Search));
        }

        if (userId.HasValue)
        {
            query = query.Where(p =>
                p.CreatedById == userId.Value ||
                p.Members.Any(m => m.UserId == userId.Value)
            );
        }

        return query;
    }

    protected override IQueryable<Project> ApplySorting(
        IQueryable<Project> query,
        QueryObject queryObject)
    {
        if (string.IsNullOrWhiteSpace(queryObject.SortBy))
            return query.OrderBy(p => p.CreatedAt);

        return queryObject.SortBy?.ToLower() switch
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

    public override async Task<Project?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
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

    public async Task<IEnumerable<Project>> GetProjectsOwnedByUserAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .Where(p => p.CreatedById == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Project>> GetAllForUserAsync(
        Guid userId, 
        QueryObject queryObject, 
        CancellationToken cancellationToken)
    {
        var query = _context.Projects
            .Include(p => p.Members)
                .ThenInclude(m => m.User)
            .Include(p => p.Tasks)
            .Include(p => p.CreatedBy)
            .AsQueryable();

        query = query.Where(p =>
            p.CreatedById == userId |
            p.Members.Any(m => m.UserId == userId)
        );

        query = ApplySorting(query, queryObject);

        int skip = (queryObject.Page - 1) * queryObject.PageSize;

        return await query.Skip(skip).Take(queryObject.PageSize).ToListAsync(cancellationToken);
    }

    public override async Task<int> CountByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _context.Set<Project>()
            .Include(p => p.Members)
            .CountAsync(p => p.CreatedById == userId || p.Members.Any(m => m.UserId == userId), cancellationToken);
    }

}
