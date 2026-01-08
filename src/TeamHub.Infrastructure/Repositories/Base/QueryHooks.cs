using Microsoft.EntityFrameworkCore;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Infrastructure.Repositories.Base;

public abstract class QueryHooks<T> where T : BaseEntity
{
    public virtual IQueryable<T> BuildQuery(ApplicationDbContext context, QueryObject query)
    {
        return context.Set<T>().AsQueryable();
    }

    public virtual IQueryable<T> ApplyFilters(IQueryable<T> query, SearchQueryObject searchQueryObject, Guid? userId = null)
    {
        return query;
    }

    public virtual IQueryable<T> ApplySorting(IQueryable<T> query, QueryObject queryObject)
    {
        if (!string.IsNullOrWhiteSpace(queryObject.SortBy))
        {
            return queryObject.Descending
                ? query.OrderByDescending(e => EF.Property<object>(e, queryObject.SortBy))
                : query.OrderBy(e => EF.Property<object>(e, queryObject.SortBy));
        }
        return query;
    }
}

