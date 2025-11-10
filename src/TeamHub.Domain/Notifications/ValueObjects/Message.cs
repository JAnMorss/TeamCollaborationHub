using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Notifications.ValueObjects;

public sealed class Message : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 500;

    private Message(string value)
    {
        Value = value;
    }

    public static Result<Message> Create(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
        {
            return Result.Failure<Message>(new Error(
                "Message.Empty",
                "Message cannot be empty."
            ));
        }

        if (message.Length > MaxLength)
        {
            return Result.Failure<Message>(new Error(
                "Message.TooLong",
                $"Message is too long. Maximum length should be {MaxLength} characters."
            ));
        }

        return new Message(message);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString()
        => Value.ToString();
    
}
