using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Tasks.Enums;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.Infrastructure.Repositories.Base;
using TeamHub.SharedKernel.Application.Helpers;

namespace TeamHub.Infrastructure.Repositories;

internal sealed class TaskRepository : UserOwnedRepository<ProjectTask>, ITaskRepository
{
    public TaskRepository(ApplicationDbContext context)
        : base(context, new TaskQueryHooks())
    {
    }

    protected override IQueryable<ProjectTask> VisibleToUser(IQueryable<ProjectTask> query, Guid userId)
    {
        return query.Where(t =>
            t.CreatedById == userId ||
            t.AssignedToId == userId ||
            t.Project.Members.Any(m => m.UserId == userId));
    }

    public override async Task<ProjectTask?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await BuildQuery(_context, new QueryObject())
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<ProjectTask>> GetOpenTasksByProjectAsync(Guid projectId, CancellationToken cancellationToken = default)
    {
        return await _context.Tasks
            .Where(t => t.ProjectId == projectId && t.Status != Taskstatus.Completed)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProjectTask>> GetOverdueTasksAsync(DateTime today, CancellationToken cancellationToken = default)
    {
        return await _context.Tasks
            .Where(t => t.DueDate < today && t.Status != Taskstatus.Completed)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProjectTask>> GetTasksAssignedToUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await BuildQuery(_context, new QueryObject())
            .Where(t => t.AssignedToId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProjectTask>> GetTasksByProjectIdAsync(Guid projectId, CancellationToken cancellationToken = default)
    {
        return await BuildQuery(_context, new QueryObject())
            .Where(t => t.ProjectId == projectId)
            .ToListAsync(cancellationToken);
    }
}

public sealed class TaskQueryHooks : QueryHooks<ProjectTask>
{
    public override IQueryable<ProjectTask> BuildQuery(ApplicationDbContext context, QueryObject query)
    {
        return context.Tasks
            .Include(t => t.Project)
                .ThenInclude(p => p.Members)
                    .ThenInclude(m => m.User)
            .Include(t => t.CreatedBy)
            .Include(t => t.AssignedTo)
            .Include(t => t.Attachments)
            .AsQueryable();
    }

    public override IQueryable<ProjectTask> ApplyFilters(IQueryable<ProjectTask> query, SearchQueryObject searchQueryObject, Guid? userId = null)
    {
        if (!string.IsNullOrWhiteSpace(searchQueryObject.Search))
        {
            query = query.Where(t => t.Title.Value.Contains(searchQueryObject.Search));
        }
        return query;
    }

    public override IQueryable<ProjectTask> ApplySorting(IQueryable<ProjectTask> query, QueryObject queryObject)
    {
        if (string.IsNullOrWhiteSpace(queryObject.SortBy))
            return query.OrderBy(t => t.CreatedAt);

        return queryObject.SortBy.ToLower() switch
        {
            "title" => queryObject.Descending ? query.OrderByDescending(t => t.Title.Value) : query.OrderBy(t => t.Title.Value),
            "priority" => queryObject.Descending ? query.OrderByDescending(t => t.Priority) : query.OrderBy(t => t.Priority),
            "status" => queryObject.Descending ? query.OrderByDescending(t => t.Status) : query.OrderBy(t => t.Status),
            "duedate" => queryObject.Descending ? query.OrderByDescending(t => t.DueDate) : query.OrderBy(t => t.DueDate),
            "createdat" => queryObject.Descending ? query.OrderByDescending(t => t.CreatedAt) : query.OrderBy(t => t.CreatedAt),
            _ => query.OrderBy(t => t.CreatedAt)
        };
    }
}