using TeamHub.Domain.Projects.Entity;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Repositories;

namespace TeamHub.Domain.Projects.Interface;

public interface IProjectRepository : IUserOwnedRepository<Project>
{

    Task<IEnumerable<Project>> GetArchivedProjectsAsync(CancellationToken cancellationToken = default);

    Task<IEnumerable<Project>> GetProjectsOwnedByUserAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<Project>> GetAllForUserAsync(Guid userId, QueryObject queryObject, CancellationToken cancellationToken);

}
