using TeamHub.SharedKernel.Domain;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Users.ValueObjects;

public sealed class LastName : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 15;

    public LastName(string value)
    {
        Value = value;
    }

    public static Result<LastName> Create(string lastname)
    {
        if (string.IsNullOrWhiteSpace(lastname))
        {
            return Result.Failure<LastName>(new Error(
                "LastName.Empty", 
                "Lastname cannot be empty."));
        }

        if (lastname.Length > MaxLength)
        {
            return Result.Failure<LastName>(new Error(
                "LastName.TooLong",
                $"Lastname is too long. Maximum length is {MaxLength} characters."));
        }

        return new LastName(lastname);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString()
        => Value.ToString();
    
}
