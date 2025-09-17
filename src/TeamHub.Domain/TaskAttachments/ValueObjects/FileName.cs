using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.Domain.TaskAttachments.ValueObjects;

public sealed class FileName : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 255;

    private FileName(string value)
    {
        Value = value;
    }

    public static Result<FileName> Create(string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return Result.Failure<FileName>(new Error(
                "FileName.Empty",
                "File name cannot be empty."));
        }

        if (fileName.Length > MaxLength)
        {
            return Result.Failure<FileName>(new Error(
                "FileName.TooLong",
                $"File name must not exceed {MaxLength} characters."));
        }

        return new FileName(fileName);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}