using TeamHub.Domain.Notifications.Entity;
using TeamHub.SharedKernel.Repositories;

namespace TeamHub.Domain.Notifications.Interface;

public interface INotificationRepository : IRepository<Notification>
{
    Task<IEnumerable<Notification>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}
