using TeamHub.SharedKernel.Domain;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Comments.ValueObjects;

public sealed class Content : ValueObject
{
    public string Value { get; }

    public Content(string value)
    {
        Value = value;
    }

    public static Result<Content> Create(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            return Result.Failure<Content>(new Error(
                "Content.Empty",
                "Content cannot be empty"));
        }

        return new Content(content);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString()
        => Value.ToString();
    
}
