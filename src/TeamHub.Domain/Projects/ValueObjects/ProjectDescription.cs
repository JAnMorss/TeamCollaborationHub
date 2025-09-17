using TeamHub.SharedKernel.Domain.Entities;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.Domain.Projects.ValueObjects;

public sealed class ProjectDescription : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 1000;
    private ProjectDescription(string value)
    {
        Value = value;
    }

    public static Result<ProjectDescription> Create(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            return Result.Failure<ProjectDescription>(new Error(
                "ProjectDescription.Empty",
                "Project description cannot be empty."));
        }

        if (description.Length > MaxLength)
        {
            return Result.Failure<ProjectDescription>(new Error(
                "ProjectDescription.TooLong",
                $"Project description is too long. Maximum Length is {MaxLength} characters."));
        }

        return new ProjectDescription(description);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}
