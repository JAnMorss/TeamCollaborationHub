using FluentAssertions;
using TeamHub.Domain.Projects.ValueObjects;

namespace TeamHub.DomainUnitTests.Projects.ValueObjects;

public class ProjectDescriptionTests
{
    [Fact]
    public void Create_Should_Return_Success_When_Description_Is_Valid()
    {
        // Arrange
        var validDescription = "This is a valid project description.";

        // Act
        var result = ProjectDescription.Create(validDescription);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(validDescription);
    }

    [Fact]
    public void Create_Should_Return_Failure_When_Description_Is_Empty()
    {
        // Arrange
        var emptyDescription = "";

        // Act
        var result = ProjectDescription.Create(emptyDescription);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("ProjectDescription.Empty");
        result.Error.Message.Should().Be("Project description cannot be empty.");
    }

    [Fact]
    public void Create_Should_Return_Failure_When_Description_Is_Whitespace()
    {
        // Arrange
        var whitespace = "   ";

        // Act
        var result = ProjectDescription.Create(whitespace);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("ProjectDescription.Empty");
        result.Error.Message.Should().Be("Project description cannot be empty.");
    }

    [Fact]
    public void Create_Should_Return_Failure_When_Description_Exceeds_MaxLength()
    {
        // Arrange
        var text = new string('a', ProjectDescription.MaxLength + 1);

        // Act
        var result = ProjectDescription.Create(text);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("ProjectDescription.TooLong");
        result.Error.Message.Should().Be($"Project description is too long. Maximum Length is {ProjectDescription.MaxLength} characters.");
    }
}
