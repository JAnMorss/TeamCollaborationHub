using TeamHub.Domain.TaskAttachments.Entity;
using TeamHub.Domain.TaskAttachments.Interface;
using TeamHub.Infrastructure.Repositories.Base;

namespace TeamHub.Infrastructure.Repositories;

internal class TaskAttachmentRepository : Repository<TaskAttachment>, ITaskAttachmentRepository
{
    public TaskAttachmentRepository(ApplicationDbContext context) : base(context)
    {
    }
}
