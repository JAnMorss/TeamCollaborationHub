using System.Net.Mail;
using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Users.ValueObjects;

public sealed class EmailAddress : ValueObject
{
    public string Value { get; private set; } 

    private EmailAddress() { }

    public EmailAddress(string value) 
    {
        Value = value;
    }

    public static Result<EmailAddress> Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return Result.Failure<EmailAddress>(new Error(
                "Email.Empty",
                "EmailAddress cannot be empty."));
        }

        try
        {
            var addr = new MailAddress(email.Trim());
            return Result.Success(new EmailAddress(addr.Address));
        }
        catch
        {
            return Result.Failure<EmailAddress>(new Error(
                "Email.Invalid",
                "Invalid email address format."));
        }
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public bool Equals(EmailAddress other)
        => other != null && Value == other.Value;

    public override string ToString()
        => Value;

}

