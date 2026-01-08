using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.SharedKernel.Repositories;

public interface IUserOwnedRepository<T> : IRepository<T> where T : BaseEntity, IUserOwned
{
    Task<int> CountByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<T?> GetByIdAndUserIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<T>> GetAllByUserAsync(Guid userId, QueryObject queryObject, CancellationToken cancellationToken = default);
}

