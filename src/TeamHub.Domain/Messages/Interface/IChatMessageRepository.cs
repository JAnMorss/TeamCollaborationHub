using TeamHub.Domain.Messages.Entity;
using TeamHub.SharedKernel.Domain.Repositories;

namespace TeamHub.Domain.Messages.Interface;

public interface IChatMessageRepository : IRepository<ChatMessage>
{
}
