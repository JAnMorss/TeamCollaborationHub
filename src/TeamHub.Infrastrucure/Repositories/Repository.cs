using Microsoft.EntityFrameworkCore;
using TeamHub.SharedKernel.Domain;
using TeamHub.SharedKernel.Helpers;

namespace TeamHub.Infrastrucure.Repositories;

internal abstract class Repository<T> where T : BaseEntity
{
    protected readonly ApplicationDbContext _context;

    protected Repository(ApplicationDbContext context)
    {
        _context = context;
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(
        QueryObject query, 
        CancellationToken cancellationToken = default)
    {
        var queryable = _context.Set<T>().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.SortBy))
        {
            queryable = query.Descending
                ? queryable.OrderByDescending(e => EF.Property<object>(e, query.SortBy))
                : queryable.OrderBy(e => EF.Property<Object>(e, query.SortBy));
        }

        var skip = (query.Page - 1) * query.PageSize;

        return await queryable
            .Skip(skip)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<T?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _context
            .Set<T>()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddAsync(
        T entity, 
        CancellationToken cancellationToken = default)
    {
        await _context
            .Set<T>()
            .AddAsync(entity, cancellationToken);
    }

    public Task UpdateAsync(
        T entity,
        CancellationToken cancellationToken = default)
    {
        _context
            .Set<T>()
            .Update(entity);

        return Task.CompletedTask;
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
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
}
