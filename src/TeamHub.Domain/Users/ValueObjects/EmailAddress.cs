using System.Net.Mail;
using TeamHub.SharedKernel.Domain;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Users.ValueObjects;

public sealed class EmailAddress : ValueObject
{
    public string Value { get; }

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
                "EmailAddress cannot bew empty."));
        }

        try
        {
            var addr = new MailAddress(email.Trim());
            return new EmailAddress(addr.Address);
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

    public override string ToString() 
        => Value;
}
