using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Tasks.ValueObjects;

public sealed class Description : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 1000;
    private Description(string value)
    {
        Value = value;
    }

    public static Result<Description> Create(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            return Result.Failure<Description>(new Error(
                "Description.Empty",
                "Description cannot be empty."));
        }

        if (description.Length > MaxLength)
        {
            return Result.Failure<Description>(new Error(
                "Description.TooLong",
                $"Description is too long. Maximum Length is {MaxLength} characters."));
        }

        return new Description(description);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString() 
        => Value;
}
