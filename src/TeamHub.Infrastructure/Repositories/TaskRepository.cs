using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Tasks.Enums;
using TeamHub.Domain.Tasks.Interface;

namespace TeamHub.Infrastructure.Repositories;

internal class TaskRepository : Repository<ProjectTask>, ITaskRepository
{
    public TaskRepository(ApplicationDbContext context) 
        : base(context)
    {
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
}
