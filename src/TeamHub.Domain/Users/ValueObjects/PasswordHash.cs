using TeamHub.SharedKernel.Domain;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Users.ValueObjects;

public sealed class PasswordHash : ValueObject
{
    public string Value { get; }

    private PasswordHash(string value)
    {
        Value = value;
    }

    public static Result<PasswordHash> Create(string hash)
    {
        if (string.IsNullOrWhiteSpace(hash))
        {
            return Result.Failure<PasswordHash>(new Error(
                "PasswordHash.Empty",
                "Password hash cannot be empty."));
        }

        // Optional: enforce minimum length (e.g., bcrypt hashes are 60 chars)
        if (hash.Length < 20)
        {
            return Result.Failure<PasswordHash>(new Error(
                "PasswordHash.Invalid",
                "Password hash format is invalid or too short."));
        }

        return new PasswordHash(hash);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString() 
        => Value;
}
