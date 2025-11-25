using FluentAssertions;
using TeamHub.Domain.Tasks.ValueObjects;

namespace TeamHub.DomainUnitTests.Tasks.ValueObjects;

public class TitleTests
{
    [Fact]
    public void Create_Should_Return_Success_When_Title_Is_Valid()
    {
        // Arrange
        var text = "Implement authentication";

        // Act
        var result = Title.Create(text);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(text);
    }

    [Fact]
    public void Create_Should_Return_Failure_When_Title_Is_Empty()
    {
        // Arrange
        var text = "";

        // Act
        var result = Title.Create(text);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Title.Empty");
        result.Error.Message.Should().Be("Title cannot be empty.");
    }

    [Fact]
    public void Create_Should_Return_Failure_When_Title_Exceeds_MaxLength()
    {
        // Arrange
        var text = new string('a', Title.MaxLength + 1);

        // Act
        var result = Title.Create(text);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Title.ToooLong");
        result.Error.Message.Should().Be($"Title is too long. Maximum Length is {Title.MaxLength} characters.");
    }
}
