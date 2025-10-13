using TeamHub.Application.Tasks.Responses;
using TeamHub.Domain.Projects.Interface;
using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.Domain.Users.Errors;
using TeamHub.Domain.Users.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.Application.Tasks.Commands.CreateTask;

public sealed class CreateTaskCommandHandler : ICommandHandler<CreateTaskCommand, TaskResponse>
{
    private readonly ITaskRepository _taskRepository;
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserRepository _userRepository;
    public CreateTaskCommandHandler(
        ITaskRepository taskRepository,
        IProjectRepository projectRepository,
        IUnitOfWork unitOfWork,
        IUserRepository userRepository)
    {
        _taskRepository = taskRepository;
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
        _userRepository = userRepository;
    }

    public async Task<Result<TaskResponse>> Handle(
        CreateTaskCommand request, 
        CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);
        if (project is null)
            return Result.Failure<TaskResponse>(TaskErrors.NotFound);

        var createdById = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (createdById is null)
            return Result.Failure<TaskResponse>(UserErrors.NotFound);

        if (request.AssignedUserId is not null)
        {
            var assignedUser = await _userRepository.GetByIdAsync(request.AssignedUserId.Value, cancellationToken);
            if (assignedUser is null)
                return Result.Failure<TaskResponse>(UserErrors.NotFound);
        }

        var createResult = ProjectTask.Create(
            Guid.NewGuid(),
            request.ProjectId,
            createdById.Id,
            request.Title,
            request.Description,
            request.Priority,
            request.Status,
            request.DueDate,
            request.AssignedUserId);

        if (createResult.IsFailure)
            return Result.Failure<TaskResponse>(createResult.Error);

        var task = createResult.Value;

        await _taskRepository.AddAsync(task, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(TaskResponse.FromEntity(task));
    }
}
