using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.TaskAttachments.ValueObjects;

public sealed class FileType : ValueObject
{
    public string Value { get; }

    private static readonly HashSet<string> AllowedTypes = new()
    {
        "jpg", "png", "pdf", "docx", "xlsx", "txt"
    };

    private FileType(string value)
    {
        Value = value;
    }

    public static Result<FileType> Create(string fileType)
    {
        if (string.IsNullOrWhiteSpace(fileType))
        {
            return Result.Failure<FileType>(new Error(
                "FileType.Empty",
                "File type cannot be empty."));
        }

        var normalized = fileType.Trim().ToLowerInvariant();

        if (!AllowedTypes.Contains(normalized))
        {
            return Result.Failure<FileType>(new Error(
                "FileType.Invalid",
                $"File type '{fileType}' is not supported."));
        }

        return new FileType(normalized);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}