using TeamHub.Domain.Projects.Entity;
using TeamHub.SharedKernel.Application.Helpers;

namespace TeamHub.Domain.Projects.Interface;

public interface IProjectRepository
{
    Task<IEnumerable<Project>> GetAllAsync(QueryObject query, CancellationToken cancellationToken = default);

    Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IEnumerable<Project>> SearchProjectsByNameAsync(string name, QueryObject queryObject, CancellationToken cancellationToken = default);

    Task<IEnumerable<Project>> GetArchivedProjectsAsync(CancellationToken cancellationToken = default);

    Task<IEnumerable<Project>> GetProjectsOwnedByUserAsync(Guid userId, CancellationToken cancellationToken = default);

    Task AddAsync(Project project, CancellationToken cancellationToken = default);

    Task UpdateAsync(Project project, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

    Task<int> CountAsync(CancellationToken cancellationToken = default);
}
