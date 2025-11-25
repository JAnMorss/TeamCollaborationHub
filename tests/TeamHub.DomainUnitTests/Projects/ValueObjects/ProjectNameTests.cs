using FluentAssertions;
using TeamHub.Domain.Projects.ValueObjects;

namespace TeamHub.DomainUnitTests.Projects.ValueObjects;

public class ProjectNameTests
{
    [Fact]
    public void Create_Should_Return_Success_When_Name_Is_Valid()
    {
        // Arrange
        var validName = "Project Alpha";

        // Act
        var result = ProjectName.Create(validName);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(validName);
    }

    [Fact]
    public void Create_Should_Return_Failure_When_Name_Is_Empty()
    {
        // Arrange
        var emptyName = "";

        // Act
        var result = ProjectName.Create(emptyName);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("ProjectName.Empty");
        result.Error.Message.Should().Be("Project name cannot be empty.");
    }

    [Fact]
    public void Create_Should_Return_Failure_When_Exceeds_MaxLength()
    {
        // Arrange
        var longName = new string('a', ProjectName.MaxLength + 1);

        // Act
        var result = ProjectName.Create(longName);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("ProjectName.TooLong");
        result.Error.Message.Should().Be($"Project name is too long. Maximum Length is {ProjectName.MaxLength} characters.");
    }
}
