using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
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

    public async Task<IEnumerable<ProjectTask>> GetAllByUserAsync(
        QueryObject query, 
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        var tasks = _context.Tasks
            .Include(t => t.Project)
                .ThenInclude(p => p.Members)
            .Include(t => t.CreatedBy)
            .Include(t => t.AssignedTo)
            .Include(t => t.Attachments)
            .AsQueryable();

        tasks = tasks.Where(t =>
            t.CreatedById == userId || 
            t.AssignedToId == userId || 
            t.Project.Members.Any(m => m.UserId == userId)
        );

        tasks = query.SortBy?.ToLower() switch
        {
            "name" => query.Descending
                      ? tasks.OrderByDescending(p => p.Title.Value)
                      : tasks.OrderBy(p => p.Title.Value),
            _ => tasks.OrderBy(p => p.CreatedAt)
        };

        var page = query.Page <= 0 ? 1 : query.Page;
        var pageSize = query.PageSize <= 0 ? 10 : query.PageSize;

        var skip = (page - 1) * pageSize;

        return await tasks
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public override async Task<ProjectTask?> GetByIdAsync(
        Guid id, 
        CancellationToken cancellationToken = default)
    {
        return await _context.Tasks
            .Include(t => t.Project)
            .Include(t => t.CreatedBy)
            .Include(t => t.AssignedTo)
            .Include(t => t.Attachments)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
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
            .Include(t => t.Project)
            .Include(t => t.Attachments)
            .Include(t => t.CreatedBy)
            .Include(t => t.AssignedTo)
            .Where(t => t.ProjectId == projectId)
            .ToListAsync(cancellationToken);
    }

}
