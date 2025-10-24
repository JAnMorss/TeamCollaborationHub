using TeamHub.Domain.TaskAttachments.Entity;
using TeamHub.SharedKernel.Domain.Repositories;

namespace TeamHub.Domain.TaskAttachments.Interface;

public interface ITaskAttachmentRepository : IRepository<TaskAttachment>
{
}
