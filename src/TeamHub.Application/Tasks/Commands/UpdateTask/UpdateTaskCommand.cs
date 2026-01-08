using TeamHub.Application.Tasks.Responses;
using TeamHub.Domain.Tasks.Enums;
using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Tasks.Commands.UpdateTask;

public sealed record UpdateTaskCommand(
    Guid Id,
    string Title,
    string Description,
    TaskPriority Priority,
    Taskstatus Status,
    DateTime? DueDate,
    Guid UserId) : ICommand<TaskResponse>;
