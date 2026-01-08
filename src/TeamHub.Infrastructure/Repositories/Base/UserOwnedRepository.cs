using Microsoft.EntityFrameworkCore;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.Repositories;

namespace TeamHub.Infrastructure.Repositories.Base;

internal abstract class UserOwnedRepository<T> : Repository<T>, IUserOwnedRepository<T>
    where T : BaseEntity, IUserOwned
{
    protected readonly QueryHooks<T> _queryHooks;

    protected UserOwnedRepository(
        ApplicationDbContext context, 
        QueryHooks<T>? queryHooks = null)  : base(context)
    {
        _queryHooks = queryHooks ?? new DefaultQueryHooks<T>();
    }

    protected abstract IQueryable<T> VisibleToUser(IQueryable<T> query, Guid userId);

    public virtual async Task<int> CountByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<T>().AsQueryable();
        query = VisibleToUser(query, userId);

        return await query.CountAsync(cancellationToken);
    }

    public async Task<T?> GetByIdAndUserIdAsync(
        Guid id,
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<T>().AsQueryable();
        query = VisibleToUser(query, userId);

        return await query.FirstOrDefaultAsync(e => e.Id == id && e.CreatedById == userId, cancellationToken);
    }

    public async Task<IEnumerable<T>> GetAllByUserAsync(
        Guid userId, 
        QueryObject queryObject, 
        CancellationToken cancellationToken = default)
    {
        var query = _queryHooks.BuildQuery(_context, queryObject);

        query = VisibleToUser(query, userId);

        query = _queryHooks.ApplyFilters(query, new SearchQueryObject(), userId);

        query = _queryHooks.ApplySorting(query, queryObject);

        int skip = (queryObject.Page - 1) * queryObject.PageSize;
        return await query.Skip(skip).Take(queryObject.PageSize).ToListAsync(cancellationToken);
    }
}

internal class DefaultQueryHooks<T> : QueryHooks<T> where T : BaseEntity { }
