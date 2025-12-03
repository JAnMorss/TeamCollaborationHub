using FluentAssertions;
using TeamHub.Domain.Users.Entities;
using TeamHub.Domain.Users.Enums;
using TeamHub.Domain.Users.Events;
using TeamHub.DomainUnitTests.Infrastructure;

namespace TeamHub.DomainUnitTests.Users;

public class UserTests : BaseTest
{

    [Fact]
    public void Create_Should_ShouldReturnSuccess_And_Raise_Event()
    {
        // Act
        var result = User.Create(
            Guid.NewGuid(),
            UserData.FirstName.Value,
            UserData.LastName.Value,
            UserData.Email.Value,
            UserData.Avatar.Value,
            UserData.PasswordHash.Value);

        // Assert
        result.IsSuccess.Should().BeTrue();

        var user = result.Value;

        user.FirstName.Value.Should().Be(UserData.FirstName.Value);
        user.LastName.Value.Should().Be(UserData.LastName.Value);
        user.Email.Value.Should().Be(UserData.Email.Value);
        user.Avatar!.Value.Should().Be(UserData.Avatar.Value);
        user.PasswordHash.Value.Should().Be(UserData.PasswordHash.Value);
        user.IsActive.Should().BeTrue();
        user.Id.Should().NotBe(Guid.Empty);

        var domainEvent = AssertDomainEventWasPublished<UserCreatedDomainEvent>(user);
        domainEvent.Id.Should().Be(user.Id);
    }

    [Fact]
    public void UpdateDetails_Should_Update_User_Values_And_Raise_Event()
    {
        // Arrange
        var user = UserData.Create();
        var newFirstName = "Jane";
        var newLastName = "Smith";
        var newEmail = "Jane.smith@test.com";

        // Act
        var result = user.UpdateDetails(newFirstName, newLastName, newEmail);

        // Assert
        result.IsSuccess.Should().BeTrue();
        user.FirstName.Value.Should().Be(newFirstName);
        user.LastName.Value.Should().Be(newLastName);
        user.Email.Value.Should().Be(newEmail);
        user.UpdatedAt.Should().NotBeNull();

        var domainEvent = AssertDomainEventWasPublished<UserUpdatedDomainEvent>(user);
        domainEvent.Id.Should().Be(user.Id);
    }

    [Fact]
    public void Activate_Should_Set_IsActive_True_And_Raise_Event()
    {
        // Arrange
        var user = UserData.Create();
        user.Deactivate();

        // Act
        var result = user.Activate();

        //Assert
        result.IsSuccess.Should().BeTrue();
        user.IsActive.Should().BeTrue();

        var domainEvent = AssertDomainEventWasPublished<UserActivatedDomainEvent>(user);
        domainEvent.Id.Should().Be(user.Id);
    }

    [Fact]
    public void Deactivate_Should_Set_IsActive_False_And_Raise_Event()
    {
        // Arrange
        var user = UserData.Create();

        // Act
        var result = user.Deactivate();

        //Assert
        result.IsSuccess.Should().BeTrue();
        user.IsActive.Should().BeFalse();

        var domainEvent = AssertDomainEventWasPublished<UserDeactiveDomainEvent>(user);
        domainEvent.Id.Should().Be(user.Id);
    }

    [Fact]
    public void UpdateAvatar_Should_Update_Avatar_And_Raise_Event()
    {
        // Arrange
        var user = UserData.Create();
        var newAvatarUrl = "https://example.com/new-avatar.png";

        // Act
        var result = user.UpdateAvatar(newAvatarUrl);

        // Assert
        result.IsSuccess.Should().BeTrue();
        user.Avatar!.Value.Should().Be(newAvatarUrl);
        user.UpdatedAt.Should().NotBeNull();

        var domainEvent = AssertDomainEventWasPublished<UserAvatarUpdatedDomainEvent>(user);
        domainEvent.Id.Should().Be(user.Id);
    }

    [Fact]
    public void PromoteToAdmin_Should_SetRole_And_Raise_Event()
    {
        // Arrange
        var user = UserData.Create();

        // Act
        var result = user.PromoteToAdmin();

        // Assert
        result.IsSuccess.Should().BeTrue();
        user.Role.Should().Be(UserRole.Admin);

        var domainEvent = AssertDomainEventWasPublished<UserPromotedToAdminDomainEvent>(user);
        domainEvent.Id.Should().Be(user.Id);
    }

    [Fact]
    public void DemoteToUser_Should_SetRole_And_Raise_Event()
    {
        // Arrange
        var user = UserData.Create();
        user.PromoteToAdmin();

        // Act
        var result = user.DemoteToUser();

        // Assert
        result.IsSuccess.Should().BeTrue();
        user.Role.Should().Be(UserRole.User);

        var domainEvent = AssertDomainEventWasPublished<UserDemotedToUserDomainEvent>(user);
        domainEvent.Id.Should().Be(user.Id);
    }



    [Fact]
    public void AddRefreshToken_Should_Add_Token_To_Collection()
    {
        // Arrange
        var user = UserData.Create();
        var token = new RefreshToken(Guid.NewGuid(), "value123", DateTime.UtcNow.AddDays(7));

        // Act
        user.AddRefreshToken(token);

        // Assert
        user.RefreshTokens.Should().Contain(token);
    }
}
