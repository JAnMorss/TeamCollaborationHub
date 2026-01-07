using TeamHub.Domain.TaskAttachments.Entity;
using TeamHub.SharedKernel.Repositories;

namespace TeamHub.Domain.TaskAttachments.Interface;

public interface ITaskAttachmentRepository : IRepository<TaskAttachment>
{
}
