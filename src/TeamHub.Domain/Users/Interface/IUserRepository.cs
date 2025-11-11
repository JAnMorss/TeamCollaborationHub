using TeamHub.Domain.Users.Entities;
using TeamHub.Domain.Users.ValueObjects;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Domain.Repositories;

namespace TeamHub.Domain.Users.Interface;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(EmailAddress email, CancellationToken cancellationToken = default);
    Task<User?> GetByIdentityIdAsync(Guid identityId, CancellationToken cancellationToken = default);
    Task<IEnumerable<User>> SearchUsersByNameAsync(string name, QueryObject queryObject, CancellationToken cancellationToken = default);
}
