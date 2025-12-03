using FluentAssertions;
using NSubstitute;
using TeamHub.Application.Tasks.Commands.AssignTask;
using TeamHub.Domain.ProjectMembers.Entity;
using TeamHub.Domain.ProjectMembers.Enums;
using TeamHub.Domain.ProjectMembers.Interface;
using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.SharedKernel;
using TeamHub.SignalR.Interface;

namespace TeamHub.ApplicationUnitTests.Tasks;

public class AssignTaskTests
{
    private static readonly AssignTaskCommand Command = new(
        Guid.NewGuid(),
        Guid.NewGuid()
    );

    private readonly AssignTaskCommandHandler _handler;
    private readonly ITaskRepository _taskRepositoryMock;
    private readonly IProjectMemberRepository _projectMemberRepositoryMock;
    private readonly IUnitOfWork _unitOfWorkMock;
    private readonly INotificationService _notificationService;

    public AssignTaskTests()
    {
        _taskRepositoryMock = Substitute.For<ITaskRepository>();
        _projectMemberRepositoryMock = Substitute.For<IProjectMemberRepository>();
        _unitOfWorkMock = Substitute.For<IUnitOfWork>();
        _notificationService = Substitute.For<INotificationService>();

        _handler = new AssignTaskCommandHandler(
            _taskRepositoryMock,
            _projectMemberRepositoryMock,
            _unitOfWorkMock,
            _notificationService);
    }


    [Fact]
    public async Task Handle_Should_ReturnFailure_WhenTaskIsNull()
    {
        // Arrange
        _taskRepositoryMock
            .GetByIdAsync(Command.TaskId, Arg.Any<CancellationToken>())
            .Returns((ProjectTask?)null);

        // Act
        var result = await _handler.Handle(Command, default);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(TaskErrors.NotFound);
    }

    [Fact]
    public async Task Handle_Should_ReturnFailure_WhenProjectMemberIsNull()
    {
        // Arrange
        var task = AssignTaskData.Create();

        _taskRepositoryMock
            .GetByIdAsync(Command.TaskId, Arg.Any<CancellationToken>())
            .Returns(task);

        _projectMemberRepositoryMock
            .GetByProjectAndUserIdAsync(
                task.ProjectId,
                Command.UserId,
                Arg.Any<CancellationToken>())
            .Returns((ProjectMember?)null);

        // Act
        var result = await _handler.Handle(Command, default);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(TaskErrors.InvalidAssignment);
    }

    [Fact]
    public async Task Handle_Should_ReturnFailure_WhenAssignToFails()
    {
        // Arrange
        var task = AssignTaskData.Create();
        var command = new AssignTaskCommand(task.Id, Guid.NewGuid());

        var existingMember = new ProjectMember(
            Guid.NewGuid(),
            task.ProjectId,
            Guid.NewGuid(),
            ProjectRole.Member);

        task.AssignTo(existingMember);

        var projectMember = new ProjectMember(
            Guid.NewGuid(), 
            task.ProjectId, 
            Guid.NewGuid(), 
            ProjectRole.Member);

        _taskRepositoryMock.GetByIdAsync(task.Id, Arg.Any<CancellationToken>())
            .Returns(task);

        _projectMemberRepositoryMock
            .GetByProjectAndUserIdAsync(
                task.ProjectId, 
                command.UserId, 
                Arg.Any<CancellationToken>())
            .Returns(projectMember);

        // Act
        var result = await _handler.Handle(command, default);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(TaskErrors.AlreadyAssigned);
    }


}
