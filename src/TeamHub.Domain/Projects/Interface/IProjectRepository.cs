using TeamHub.Domain.Projects.Entity;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Domain.Repositories;

namespace TeamHub.Domain.Projects.Interface;

public interface IProjectRepository : IRepository<Project>
{
    Task<IEnumerable<Project>> SearchProjectsByNameAsync(string name, QueryObject queryObject, CancellationToken cancellationToken = default);

    Task<IEnumerable<Project>> GetArchivedProjectsAsync(CancellationToken cancellationToken = default);

    Task<IEnumerable<Project>> GetProjectsOwnedByUserAsync(Guid userId, CancellationToken cancellationToken = default);
}
