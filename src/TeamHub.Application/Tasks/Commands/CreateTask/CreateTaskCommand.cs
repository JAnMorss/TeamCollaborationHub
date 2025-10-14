using TeamHub.Application.Tasks.Responses;
using TeamHub.Domain.Tasks.Enums;
using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Tasks.Commands.CreateTask;

public sealed record CreateTaskCommand(
    Guid ProjectId,
    Guid UserId,
    string Title,
    string Description,
    TaskPriority Priority,
    Taskstatus Status,
    DateTime? DueDate) : ICommand<TaskResponse>;