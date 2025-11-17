using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Messages.Entity;

public sealed class ChatMessage : BaseEntity
{
    private ChatMessage() { }

    public ChatMessage(
        Guid id, 
        Guid taskId, 
        Guid senderId, 
        string content,
        DateTime createAt) : base(id)
    {
        TaskId = taskId;
        SenderId = senderId;
        Content = content;
        CreateAt = createAt;
    }

    public Guid TaskId { get; private set; }

    public Guid SenderId { get; private set; }

    public string Content { get; private set; } = null!;

    public DateTime CreateAt { get; private set; } = DateTime.UtcNow;
}
