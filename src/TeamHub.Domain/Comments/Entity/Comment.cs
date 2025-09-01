using TeamHub.Domain.Comments.ValueObjects;
using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.Comments.Entity;

public sealed class Comment : BaseEntity
{
    private Comment() { }

    public Comment(
        Guid id,
        Content? content,
        DateTime? updatedAt,
        bool isEdited,
        Guid taskId,
        Guid authorId) : base(id)
    {
        Content = content;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = updatedAt;
        IsEdited = isEdited;
        TaskId = taskId;
        AuthorId = authorId;
    }

    public Content? Content { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public bool IsEdited { get; private set; }

    public Guid TaskId { get; private set; }
    public Guid AuthorId { get; private set; }

    public Task? Task { get; private set; }
    public User? Author { get; private set; }
}
