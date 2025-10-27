using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.TaskAttachments.ValueObjects;

public sealed class FileType : ValueObject
{
    public string Value { get; }

    private static readonly Dictionary<string, string> MimeToExtension = new()
    {
        { "image/jpeg", "jpg" },
        { "image/jpg", "jpg" },
        { "image/png", "png" },
        { "application/pdf", "pdf" },
        { "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx" },
        { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx" },
        { "text/plain", "txt" },
        { "application/zip", "zip" },
        { "application/x-zip-compressed", "zip" }
    };

    private static readonly HashSet<string> AllowedExtensions = new()
    {
        "jpg", "png", "pdf", "docx", "xlsx", "txt", "zip"
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

        if (MimeToExtension.TryGetValue(normalized, out var mappedExtension))
        {
            normalized = mappedExtension;
        }

        if (!AllowedExtensions.Contains(normalized))
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
