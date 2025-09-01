using TeamHub.SharedKernel.Domain;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.TaskAttachments.ValueObjects;

public sealed class FilePath : ValueObject
{
    public string Value { get; }

    private FilePath(string value)
    {
        Value = value;
    }

    public static Result<FilePath> Create(string filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
        {
            return Result.Failure<FilePath>(new Error(
                "FilePath.Empty",
                "File path cannot be empty."));
        }


        return new FilePath(filePath);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}