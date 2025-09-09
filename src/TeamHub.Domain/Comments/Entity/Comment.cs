using TeamHub.Domain.Comments.Events;
using TeamHub.Domain.Comments.ValueObjects;
using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel.Domain;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Comments.Entity;

public sealed class Comment : BaseEntity
{
    private Comment() { }

    private Comment(
        Guid id,
        Content content,
        Guid taskId,
        Guid authorId) : base(id)
    {
        Content = content;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;
        IsEdited = false;
        TaskId = taskId;
        AuthorId = authorId;
    }

    public Content Content { get; private set; } = null!; 
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public bool IsEdited { get; private set; }

    public Guid TaskId { get; private set; }
    public Guid AuthorId { get; private set; }

    public ProjectTask? Task { get; private set; }   
    public User? Author { get; private set; }       


    public static Result<Comment> Create(
        string content,
        Guid taskId,
        Guid authorId)
    {
        var contentResult = Content.Create(content);
        if (contentResult.IsFailure)
            return Result.Failure<Comment>(contentResult.Error);

        var comment = new Comment(
            Guid.NewGuid(),
            contentResult.Value,
            taskId,
            authorId);

        comment.RaiseDomainEvent(new CommentCreatedDomainEvent(comment.Id, taskId, authorId));

        return Result.Success(comment);
    }

    public Result UpdateContent(string newContent)
    {
        var contentResult = Content.Create(newContent);
        if (contentResult.IsFailure)
            return Result.Failure(contentResult.Error);

        Content = contentResult.Value;
        IsEdited = true;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new CommentUpdatedDomainEvent(Id));

        return Result.Success();
    }
}
