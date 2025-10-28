using TeamHub.Domain.Tasks.Entity;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Domain.Repositories;

namespace TeamHub.Domain.Tasks.Interface;

public interface ITaskRepository : IRepository<ProjectTask>
{
    Task<IEnumerable<ProjectTask>> GetTasksByProjectIdAsync(Guid projectId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProjectTask>> GetOpenTasksByProjectAsync(Guid projectId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProjectTask>> GetTasksAssignedToUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProjectTask>> GetOverdueTasksAsync(DateTime today, CancellationToken cancellationToken = default);

    Task<IEnumerable<ProjectTask>> GetAllByUserAsync(QueryObject query, Guid userId, CancellationToken cancellationToken = default);
}
