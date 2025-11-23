using TeamHub.Domain.Projects.ValueObjects;

namespace TeamHub.DomainUnitTests.Projects;

internal static class ProjectData
{
    public static readonly ProjectName Name = ProjectName.Create("Sample Project").Value;
    public static readonly ProjectDescription Description = ProjectDescription.Create("This is a sample project").Value;
    public static readonly ProjectColor Color = ProjectColor.Create("#FF5733").Value;
}
