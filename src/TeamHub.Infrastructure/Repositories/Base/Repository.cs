using Microsoft.EntityFrameworkCore;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.Repositories;

namespace TeamHub.Infrastructure.Repositories.Base;

internal abstract class Repository<T> : QueryHooks<T>, IRepository<T> where T : BaseEntity
{
    protected readonly ApplicationDbContext _context;

    protected Repository(ApplicationDbContext context)
    {
        _context = context;
    }

    public virtual async Task AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        await _context
            .Set<T>()
            .AddAsync(entity, cancellationToken);
    }

    public virtual async Task<int> CountAsync(CancellationToken cancellationToken = default)
    {
        return await _context
            .Set<T>()
            .CountAsync(cancellationToken);
    }

    public virtual async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await GetByIdAsync(id, cancellationToken);
        if (entity != null)
        {
            _context
                .Set<T>()
                .Remove(entity);

            return true;
        }

        return false;
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(
        QueryObject queryObject,
        CancellationToken cancellationToken = default)
    {
        var query = BuildQuery(_context, queryObject);
        query = ApplySorting(query, queryObject);

        int skip = (queryObject.Page - 1) * queryObject.PageSize;

        return await query
            .Skip(skip)
            .Take(queryObject.PageSize)
            .ToListAsync(cancellationToken);
    }

    public virtual async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context
            .Set<T>()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public virtual async Task<IEnumerable<T>> SearchAsync(
        SearchQueryObject searchQueryObject, 
        Guid? userId,
        CancellationToken cancellationToken = default)
    {
        var query = BuildQuery(_context, searchQueryObject);
        query = ApplyFilters(query, searchQueryObject, userId);
        query = ApplySorting(query, searchQueryObject);

        int skip = (searchQueryObject.Page - 1) * searchQueryObject.PageSize;

        return query;
    }

    public virtual Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        _context
            .Set<T>()
            .Update(entity);

        return Task.CompletedTask;
    }
}
