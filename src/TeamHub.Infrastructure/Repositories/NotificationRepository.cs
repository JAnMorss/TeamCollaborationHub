using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.Notifications.Entity;
using TeamHub.Domain.Notifications.Interface;
using TeamHub.Infrastructure.Repositories.Base;

namespace TeamHub.Infrastructure.Repositories;

internal sealed class NotificationRepository : Repository<Notification>, INotificationRepository
{
    public NotificationRepository(ApplicationDbContext context) 
        : base(context)
    {
    }

    public async Task<IEnumerable<Notification>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Notification>()
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
