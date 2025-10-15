using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Users.ValueObjects;

public sealed class Avatar : ValueObject
{
    public string Value { get; }

    public Avatar(string value)
    {
        Value = value;
    }

    public static Result<Avatar> Create(string url)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            return Result.Failure<Avatar>(new Error(
                "Avatar.Empty",
                "Avatar URL cannot be empty."));
        }

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uriResult) || 
            (uriResult.Scheme != Uri.UriSchemeHttp && uriResult.Scheme != Uri.UriSchemeHttps))
        {
            return Result.Failure<Avatar>(new Error(
                "Avatar.InvalidUrl",
                "Avatar URL must be a valid HTTP or HTTPS URL."));
        }

        return new Avatar(url);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString()
        => Value;
    
}
