using System.Text.RegularExpressions;
using TeamHub.SharedKernel.Domain;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Projects.ValueObjects;

public sealed class ProjectColor : ValueObject
{
    public string Value { get; }

    private ProjectColor(string value)
    {
        Value = value;
    }

    public static Result<ProjectColor> Create(string color)
    {
        if (string.IsNullOrWhiteSpace(color))
        {
            return Result.Failure<ProjectColor>(new Error(
                "ProjectColor.Empty",
                "Project color cannot be empty."));
        }

        var hexPattern = "^#(?:[0-9a-fA-F]{3}){1,2}$";
        if (!Regex.IsMatch(color, hexPattern))
        {
            return Result.Failure<ProjectColor>(new Error(
                "ProjectColor.Invalid",
                "Project color must be a valid HEX code (e.g., #FFFFFF)."));
        }

        return new ProjectColor(color);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}
