using FluentAssertions;
using TeamHub.Domain.Tasks.ValueObjects;

namespace TeamHub.DomainUnitTests.Tasks.ValueObjects;

public class DescriptionTests
{
    [Fact]
    public void Create_Should_Return_Succeess_When_Description_Is_Valid()
    {
        // Arrange
        var validDescription = "This is a valid task description.";

        // Act
        var result = Description.Create(validDescription);

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
        var result = Description.Create(emptyDescription);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Description.Empty");
        result.Error.Message.Should().Be("Description cannot be empty.");
    }

    [Fact]
    public void Create_Should_Return_Failure_When_Description_Exceeds_MaxLength()
    {
        // Arrange
        var text = new string('a', Description.MaxLength + 1);

        // Act
        var result = Description.Create(text);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Description.TooLong");
        result.Error.Message.Should().Be($"Description is too long. Maximum Length is {Description.MaxLength} characters.");
    }
}
