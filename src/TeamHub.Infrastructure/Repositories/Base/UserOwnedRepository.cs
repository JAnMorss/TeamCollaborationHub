using Microsoft.EntityFrameworkCore;
using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.Repositories;

namespace TeamHub.Infrastructure.Repositories.Base;

internal abstract class UserOwnedRepository<T> : Repository<T>, IUserOwnedRepository<T>
    where T : BaseEntity, IUserOwned
{
    protected UserOwnedRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    public virtual async Task<int> CountByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context
            .Set<T>()
            .CountAsync(e => e.CreatedById == userId, cancellationToken);
    }

    public async Task<T?> GetByIdAndUserIdAsync(
        Guid id,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context
            .Set<T>()
            .FirstOrDefaultAsync(e => e.Id == id && e.CreatedById == userId, cancellationToken);
    }
}

