using TeamHub.Domain.Tasks.Entity;
using TeamHub.SharedKernel.Application.Helpers;

namespace TeamHub.Domain.Tasks.Interface;

public interface ITaskRepository
{
    Task<IEnumerable<ProjectTask>> GetAllAsync(QueryObject query, CancellationToken cancellationToken = default);
    Task<ProjectTask?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IEnumerable<ProjectTask>> GetOpenTasksByProjectAsync(Guid projectId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProjectTask>> GetTasksAssignedToUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProjectTask>> GetOverdueTasksAsync(DateTime today, CancellationToken cancellationToken = default);

    Task AddAsync(ProjectTask task, CancellationToken cancellationToken = default);
    Task UpdateAsync(ProjectTask task, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
