using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.Users.Entities;
using TeamHub.Domain.Users.Interface;
using TeamHub.Domain.Users.ValueObjects;

namespace TeamHub.Infrastructure.Repositories;

internal sealed class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(EmailAddress email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }
}