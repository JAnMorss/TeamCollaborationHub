using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.Domain.TaskAttachments.ValueObjects;

public sealed class FileSize : ValueObject
{
    public long Value { get; }
    public const long MaxSizeInBytes = 10 * 1024 * 1024; 

    private FileSize(long value)
    {
        Value = value;
    }

    public static Result<FileSize> Create(long fileSize)
    {
        if (fileSize <= 0)
        {
            return Result.Failure<FileSize>(new Error(
                "FileSize.Invalid",
                "File size must be greater than zero."));
        }

        if (fileSize > MaxSizeInBytes)
        {
            return Result.Failure<FileSize>(new Error(
                "FileSize.TooLarge",
                $"File size must not exceed {MaxSizeInBytes / 1024 / 1024} MB."));
        }

        return new FileSize(fileSize);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString() => $"{Value} bytes";
}
