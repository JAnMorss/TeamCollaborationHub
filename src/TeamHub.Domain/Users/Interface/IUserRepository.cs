using TeamHub.Domain.Users.Entities;
using TeamHub.Domain.Users.ValueObjects;

namespace TeamHub.Domain.Users.Interface;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(EmailAddress email, CancellationToken cancellationToken = default);
    Task<User?> GetByIdentityIdAsync(Guid identityId, CancellationToken cancellationToken = default);
    Task AddAsync(User user, CancellationToken cancellationToken = default);
    Task UpdateAsync(User user, CancellationToken cancellationToken = default);
}
