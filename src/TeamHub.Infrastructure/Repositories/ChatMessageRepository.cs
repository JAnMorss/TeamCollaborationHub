using TeamHub.Domain.Messages.Entity;
using TeamHub.Domain.Messages.Interface;

namespace TeamHub.Infrastructure.Repositories;

internal sealed class ChatMessageRepository : Repository<ChatMessage>, IChatMessageRepository
{
    public ChatMessageRepository(ApplicationDbContext context)
        : base(context)
    {
    }
}
