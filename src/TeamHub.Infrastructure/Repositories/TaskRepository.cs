using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.Projects.Entity;
using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Tasks.Enums;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.SharedKernel.Application.Helpers;

namespace TeamHub.Infrastructure.Repositories;

internal class TaskRepository : Repository<ProjectTask>, ITaskRepository
{
    public TaskRepository(ApplicationDbContext context) 
        : base(context)
    {
    }

    public override async Task<IEnumerable<ProjectTask>> GetAllAsync(
    QueryObject query,
    CancellationToken cancellationToken = default)
    {
        var task = _context.Tasks
            .Include(t => t.CreatedBy)
            .Include(t => t.AssignedTo)
            .Include(t => t.Comments)
                .ThenInclude(c => c.Author)
            .Include(t => t.Attachments)
            .AsQueryable();

        task = query.SortBy?.ToLower() switch
        {
            "name" => query.Descending
                      ? task.OrderByDescending(p => p.Title.Value)
                      : task.OrderBy(p => p.Title.Value),
            _ => task.OrderBy(p => p.CreatedAt)
        };

        var page = query.Page <= 0 ? 1 : query.Page;
        var pageSize = query.PageSize <= 0 ? 10 : query.PageSize;

        var skip = (page - 1) * pageSize;

        return await task
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProjectTask>> GetOpenTasksByProjectAsync(
        Guid projectId, 
        CancellationToken cancellationToken = default)
    {
        return await _context.Tasks
           .Where(t => t.ProjectId == projectId && t.Status != Taskstatus.Completed)
           .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProjectTask>> GetOverdueTasksAsync(
        DateTime today, 
        CancellationToken cancellationToken = default)
    {
        return await _context.Tasks
            .Where(t => t.DueDate < today && t.Status != Taskstatus.Completed)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProjectTask>> GetTasksAssignedToUserAsync(
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        return await _context.Tasks
            .Where(t => t.AssignedToId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProjectTask>> GetTasksByProjectIdAsync(Guid projectId, CancellationToken cancellationToken = default)
    {
        return await _context.Tasks
            .Include(t => t.Comments)
            .Include(t => t.Attachments)
            .Include(t => t.CreatedBy)
            .Where(t => t.ProjectId == projectId)
            .ToListAsync(cancellationToken);
    }
}
