using TeamHub.Domain.Tasks.Enums;

namespace TeamHub.API.Controllers.Tasks;

public sealed record TaskRequest(
    Guid ProjectId,
    string Title,
    string Description,
    TaskPriority Priority,      
    Taskstatus Status,     
    DateTime? DueDate,
    Guid? AssignedUserId
);
