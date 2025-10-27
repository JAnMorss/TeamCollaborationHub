using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Users.ValueObjects;

public sealed class Avatar : ValueObject
{
    public string Value { get; }

    private Avatar(string value)
    {
        Value = value;
    }

    public static Result<Avatar> Create(string url)
    {

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uriResult) ||
            (uriResult.Scheme != Uri.UriSchemeHttp && uriResult.Scheme != Uri.UriSchemeHttps))
        {
            return Result.Failure<Avatar>(new Error(
                "Avatar.InvalidUrl", 
                "Invalid avatar URL."));
        }

        return new Avatar(url);
    }

    public static Guid? ExtractFileIdFromUrl(string url)
    {
        try
        {
            var segments = new Uri(url).Segments;
            if (segments.Length == 0) return null;

            var fileName = segments.Last().Trim('/');
            return Guid.TryParse(fileName, out var fileId) ? fileId : null;
        }
        catch
        {
            return null;
        }
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}

