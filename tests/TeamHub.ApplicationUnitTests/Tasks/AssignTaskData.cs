using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Tasks.Enums;
using TeamHub.Domain.Tasks.ValueObjects;

namespace TeamHub.ApplicationUnitTests.Tasks;

internal static class AssignTaskData
{
    public static ProjectTask Create() => ProjectTask.Create(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            Title.Value,
            Description.Value,
            TaskPriority.Low,
            Taskstatus.Todo,
            null).Value;
    
    public static readonly  Title Title =
        Title.Create("Implement authentication module").Value;

    public static readonly  Description Description =
        Description.Create("Develop and integrate user authentication features using OAuth2.").Value;
}
