using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Notifications.ValueObjects;

public sealed class ActionUrl : ValueObject
{
    public string Value { get; }

    private ActionUrl(string value)
    {
        Value = value;
    }

    public static Result<ActionUrl> Create(string url)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            return Result.Failure<ActionUrl>(new Error(
                "ActionUrl.Empty",
                "Action URL cannot be empty."));
        }

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uriResult) ||
            (uriResult.Scheme != Uri.UriSchemeHttp && uriResult.Scheme != Uri.UriSchemeHttps))
        {
            return Result.Failure<ActionUrl>(new Error(
                "ActionUrl.InvalidUrl",
                "Action URL must be a valid HTTP or HTTPS URL."));
        }

        return new ActionUrl(url);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}
