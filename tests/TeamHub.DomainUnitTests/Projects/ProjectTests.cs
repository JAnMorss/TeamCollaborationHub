using FluentAssertions;
using TeamHub.Domain.Projects.Entity;
using TeamHub.Domain.Projects.Events;
using TeamHub.Domain.Projects.Errors;
using TeamHub.Domain.ProjectMembers.Enums;
using TeamHub.Domain.Users.Entities;
using TeamHub.DomainUnitTests.Infrastructure;
using TeamHub.DomainUnitTests.Users;

namespace TeamHub.DomainUnitTests.Projects;

public class ProjectTests : BaseTest
{
    private static Project CreateValidProject()
    {
        var user = CreateValidUser();
        var result = Project.Create(
            Guid.NewGuid(),
            user.Id,
            ProjectData.Name.Value,
            ProjectData.Description.Value,
            ProjectData.Color.Value);
        return result.Value;
    }

    private static User CreateValidUser()
    {
        return User.Create(
            Guid.NewGuid(),
            UserData.FirstName.Value,
            UserData.LastName.Value,
            UserData.Email.Value,
            UserData.Avatar.Value,
            UserData.passwordHash.Value).Value;
    }

    [Fact]
    public void Create_Should_Return_Success_And_Raise_Event()
    {
        // Arrange
        var user = CreateValidUser();
        var project = CreateValidProject();

        // Act
        var result = Project.Create(
            project.Id, 
            user.Id,
            project.Name.Value,
            project.Description.Value,
            project.Color.Value);

        // Assert
        result.IsSuccess.Should().BeTrue();
        project.Name.Value.Should().Be(ProjectData.Name.Value);
        project.Description.Value.Should().Be(ProjectData.Description.Value);
        project.Color.Value.Should().Be(ProjectData.Color.Value);
        project.IsActive.Should().BeTrue();
        project.IsArchived.Should().BeFalse();

        var domainEvent = AssertDomainEventWasPublished<ProjectCreatedDomainEvent>(project);
        domainEvent.Id.Should().Be(project.Id);
    }

    [Fact]
    public void UpdateDetails_Should_Update_Project_Values_And_Raise_Event()
    {
        // Arrange
        var project = CreateValidProject();
        var newName = "Updated Project";
        var newDescription = "Updated Description";
        var newColor = "#0000FF";

        // Act
        var result = project.UpdateDetails(newName, newDescription, newColor);

        // Assert
        result.IsSuccess.Should().BeTrue();
        project.Name.Value.Should().Be(newName);
        project.Description.Value.Should().Be(newDescription);
        project.Color.Value.Should().Be(newColor);

        var domainEvent = AssertDomainEventWasPublished<ProjectUpdatedDomainEvent>(project);
        domainEvent.Id.Should().Be(project.Id);
    }

    [Fact]
    public void UpdateDetails_Should_Fail_When_No_Changes()
    {
        // Arrange
        var project = CreateValidProject();

        // Act
        var result = project.UpdateDetails(
            project.Name.Value,
            project.Description.Value,
            project.Color.Value);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ProjectErrors.NoChanges);
    }

    [Fact]
    public void AddMember_Should_Add_User_And_Raise_Event()
    {
        // Arrange
        var project = CreateValidProject();
        var user = CreateValidUser();
        var role = ProjectRole.Member;

        // Act
        var result = project.AddMember(user, role);

        // Assert
        result.IsSuccess.Should().BeTrue();
        project.Members.Should().ContainSingle(m => m.UserId == user.Id);

        var domainEvent = AssertDomainEventWasPublished<ProjectMemberAddedDomainEvent>(project);
        domainEvent.Id.Should().Be(project.Id);
        domainEvent.userId.Should().Be(user.Id);
    }

    [Fact]
    public void AddMember_Should_Fail_When_User_Already_Member()
    {
        // Arrange
        var project = CreateValidProject();
        var user = CreateValidUser();
        project.AddMember(user, ProjectRole.Member);

        // Act
        var result = project.AddMember(user, ProjectRole.Member);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ProjectErrors.AlreadyMember);
    }

    [Fact]
    public void RemoveMember_Should_Remove_User_And_Raise_Event()
    {
        // Arrange
        var project = CreateValidProject();
        var user = CreateValidUser();
        project.AddMember(user, ProjectRole.Member);

        // Act
        var result = project.RemoveMember(user.Id);

        // Assert
        result.IsSuccess.Should().BeTrue();
        project.Members.Should().NotContain(m => m.UserId == user.Id);

        var domainEvent = AssertDomainEventWasPublished<ProjectMemberRemovedDomainEvent>(project);
        domainEvent.Id.Should().Be(project.Id);
        domainEvent.userId.Should().Be(user.Id);
    }

    [Fact]
    public void RemoveMember_Should_Fail_When_User_Not_Member()
    {
        // Arrange
        var project = CreateValidProject();
        var nonMemberId = Guid.NewGuid();

        // Act
        var result = project.RemoveMember(nonMemberId);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ProjectErrors.MemberNotFound);
    }

    [Fact]
    public void Archive_Should_Set_IsActive_False_And_Raise_Event()
    {
        // Arrange
        var project = CreateValidProject();

        // Act
        var result = project.Archive();

        // Assert
        result.IsSuccess.Should().BeTrue();
        project.IsActive.Should().BeFalse();
        project.IsArchived.Should().BeTrue();

        var domainEvent = AssertDomainEventWasPublished<ProjectArchivedDomainEvent>(project);
        domainEvent.Id.Should().Be(project.Id);
    }

    [Fact]
    public void Archive_Should_Fail_When_Already_Archived()
    {
        // Arrange
        var project = CreateValidProject();
        project.Archive();

        // Act
        var result = project.Archive();

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ProjectErrors.AlreadyArchived);
    }
}
