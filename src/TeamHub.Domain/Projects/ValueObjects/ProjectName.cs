using TeamHub.SharedKernel.Domain;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Projects.ValueObjects;

public sealed class ProjectName : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 100;

    private ProjectName(string value)
    {
        Value = value;
    }

    public static Result<ProjectName> Create(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return Result.Failure<ProjectName>(new Error(
                "ProjectName.Empty",
                "Project name cannot be empty."));
        }

        if (name.Length > MaxLength)
        {
            return Result.Failure<ProjectName>(new Error(
                "ProjectName.TooLong",
                $"Project name is too long. Maximum Length is {MaxLength} characters."));
        }

        return new ProjectName(name);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}
