using FluentAssertions;
using TeamHub.Domain.ProjectMembers.Entity;
using TeamHub.Domain.ProjectMembers.Enums;
using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Tasks.Enums;
using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.Events;
using TeamHub.DomainUnitTests.Infrastructure;

namespace TeamHub.DomainUnitTests.Tasks;

public class ProjectTaskTests : BaseTest
{
    private static ProjectTask CreateValidTask()
    {
        return ProjectTask.Create(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            "Test Task",
            "Description here",
            TaskPriority.Medium,
            Taskstatus.Todo,
            DateTime.UtcNow.AddDays(7)
        ).Value;
    }

    [Fact]
    public void Create_Should_Return_Success_And_Raise_Event()
    {
        // Arrange
        var result = ProjectTask.Create(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            "Sample Task",
            "Description",
            TaskPriority.High,
            Taskstatus.Todo,
            DateTime.UtcNow);

        // Act
        var task = result.Value;

        // Assert
        result.IsSuccess.Should().BeTrue();
        task.Title.Value.Should().Be("Sample Task");

        var domainEvent = AssertDomainEventWasPublished<TaskCreatedDomainEvent>(task);
        domainEvent.ProjectId.Should().Be(task.Id);
    }

    [Fact]
    public void UpdateDetails_Should_Update_Values_And_Raise_Event()
    {
        // Arrange
        var task = CreateValidTask();

        // Act
        var result = task.UpdateDetails(
            "Updated Title",
            "Updated Description",
            TaskPriority.Low,
            DateTime.UtcNow.AddDays(10),
            Taskstatus.InProgress);

        // Assert
        result.IsSuccess.Should().BeTrue();
        task.Title.Value.Should().Be("Updated Title");
        task.Description.Value.Should().Be("Updated Description");
        task.Priority.Should().Be(TaskPriority.Low);
        task.Status.Should().Be(Taskstatus.InProgress);
        task.UpdatedAt.Should().NotBeNull();

        // Assert domain events
        var events = task.GetDomainEvents().ToList();
        events.OfType<TaskStatusChangedDomainEvent>().Should().ContainSingle()
            .Which.Id.Should().Be(task.Id);
        events.OfType<TaskUpdatedDomainEvent>().Should().ContainSingle()
            .Which.Id.Should().Be(task.Id);

        task.ClearDomainEvents();
    }

    [Fact]
    public void UpdateDetails_Should_Fail_When_No_Changes()
    {
        // Arrange
        var task = CreateValidTask();

        // Act
        var result = task.UpdateDetails(
            task.Title.Value,
            task.Description.Value,
            task.Priority,
            task.DueDate,
            task.Status);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(TaskErrors.NoChanges);
    }

    [Fact]
    public void ChangeStatus_Should_Update_And_Raise_Event()
    {
        // Arrange
        var task = CreateValidTask();

        // Act
        var result = task.ChangeStatus(Taskstatus.Completed);

        // Assert
        result.IsSuccess.Should().BeTrue();
        task.Status.Should().Be(Taskstatus.Completed);

        var domainEvent = AssertDomainEventWasPublished<TaskStatusChangedDomainEvent>(task);
        domainEvent.Id.Should().Be(task.Id);
    }

    [Fact]
    public void ChangeStatus_Should_Fail_When_Same_Status()
    {
        // Arrange
        var task = CreateValidTask();

        // Act
        var result = task.ChangeStatus(task.Status);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(TaskErrors.AlreadyInStatus);
    }

    [Fact]
    public void AssignTo_Should_Assign_User_And_Raise_Event()
    {
        // Arrange
        var task = CreateValidTask();
        var member = new ProjectMember(Guid.NewGuid(), task.ProjectId, Guid.NewGuid(), ProjectRole.Member);

        // Act
        var result = task.AssignTo(member);

        // Assert
        result.IsSuccess.Should().BeTrue();
        task.AssignedToId.Should().Be(member.UserId);

        var domainEvent = AssertDomainEventWasPublished<TaskAssignedDomainEvent>(task);
        domainEvent.Id.Should().Be(task.Id);
    }

    [Fact]
    public void AssignTo_Should_Fail_When_ProjectId_Does_Not_Match()
    {
        // Arrange
        var task = CreateValidTask();
        var member = new ProjectMember(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), ProjectRole.Member);

        // Act
        var result = task.AssignTo(member);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(TaskErrors.InvalidAssignment);
    }

    [Fact]
    public void Unassign_Should_Clear_Assigned_User_And_Raise_Event()
    {
        // Arrange
        var task = CreateValidTask();
        var member = new ProjectMember(Guid.NewGuid(), task.ProjectId, Guid.NewGuid(), ProjectRole.Member);
        task.AssignTo(member);

        // Act
        var result = task.Unassign();

        // Assert
        result.IsSuccess.Should().BeTrue();
        task.AssignedToId.Should().BeNull();

        var domainEvent = AssertDomainEventWasPublished<TaskUnassignedDomainEvent>(task);
        domainEvent.Id.Should().Be(task.Id);
    }
}
