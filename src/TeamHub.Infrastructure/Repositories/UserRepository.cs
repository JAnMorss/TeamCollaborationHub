using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.Users.Entities;
using TeamHub.Domain.Users.Interface;
using TeamHub.Domain.Users.ValueObjects;
using TeamHub.Infrastructure.Repositories.Base;
using TeamHub.SharedKernel.Application.Helpers;

namespace TeamHub.Infrastructure.Repositories;

internal sealed class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(
        EmailAddress email, 
        CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(
                u => u.Email.Value == email.Value, 
                cancellationToken
            );
    }

    public async Task<User?> GetByIdentityIdAsync(
        Guid identityId, 
        CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .FirstOrDefaultAsync(
                u => u.IdentityId == identityId.ToString(), 
                cancellationToken
            );

    }

    public async Task<IEnumerable<User>> SearchUsersByNameAsync(
        string name,
        QueryObject queryObject,
        CancellationToken cancellationToken = default)
    {
        var users = _context.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
        {
            users = users.Where(u =>
                u.FirstName.Value.Contains(name) ||
                u.LastName.Value.Contains(name) ||
                u.Email.Value.Contains(name));
        }

        var validSortColumns = new[]
        {
            "FirstName",
            "LastName",
            "Email",
            "CreatedAt"
        };

        if (!string.IsNullOrWhiteSpace(queryObject.SortBy) && validSortColumns.Contains(queryObject.SortBy))
        {
            users = queryObject.Descending
                ? users.OrderByDescending(u => EF.Property<object>(u, queryObject.SortBy!))
                : users.OrderBy(u => EF.Property<object>(u, queryObject.SortBy!));
        }
        else
        {
            users = users.OrderBy(u => u.FirstName.Value)
                         .ThenBy(u => u.LastName.Value);
        }

        var skip = (queryObject.Page - 1) * queryObject.PageSize;
        return await users
            .Skip(skip)
            .Take(queryObject.PageSize)
            .ToListAsync(cancellationToken);
    }
}