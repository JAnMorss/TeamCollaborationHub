using TeamHub.Domain.Messages.Entity;
using TeamHub.SharedKernel.Repositories;

namespace TeamHub.Domain.Messages.Interface;

public interface IChatMessageRepository : IRepository<ChatMessage>
{
}
