using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Tasks.ValueObjects;

public sealed class Title : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 100;

    private Title(string value)
    {
        Value = value;
    }

    public static Result<Title> Create(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return Result.Failure<Title>(new Error(
                "Title.Empty",
                "Title cannot be empty."
            ));
        }

        if (title.Length > MaxLength)
        {
            return Result.Failure<Title>(new Error(
                "Title.ToooLong",
                $"Title is too long. Maximum Length is {MaxLength} characters."
            ));
        }

        return new Title(title);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString()
        => Value.ToString();
}
