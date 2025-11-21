using FluentAssertions;
using TeamHub.Domain.Users.ValueObjects;

namespace TeamHub.DomainUnitTests.Users.ValueObjects;

public class FirstNameTests
{
    [Fact]
    public void Create_Should_ReturnSuccess_For_ValidFirstName()
    {
        // Arrange
        var validFirstName = "John";

        // Act
        var result = FirstName.Create(validFirstName);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(validFirstName);
    }

    [Fact]
    public void Create_Should_ReturnFailure_For_EmptyFirstName()
    {
        // Arrange
        var invalidName = "";

        // Act
        var result = FirstName.Create(invalidName);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("firstName.Empty");
        result.Error.Message.Should().Be("Firstname cannot be empty.");
    }

    [Fact]
    public void Create_Should_ReturnFailure_For_TooLongFirstName()
    {
        // Arrange
        var longName = new string('A', FirstName.MaxLength + 1);

        // Act
        var result = FirstName.Create(longName);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("FirstName.TooLong");
        result.Error.Message.Should().Be(
            $"Firstname is too long. Maximum Length is {FirstName.MaxLength} characters."
        );
    }

    [Fact]
    public void GetAtomicValues_Should_Return_CorrectValues()
    {
        // Arrange
        var vo = FirstName.Create("JAnMors").Value;

        // Act
        var atomicValues = vo.GetAtomicValues().ToList();

        // Assert
        atomicValues.Should().ContainSingle().And.Contain("JAnMors");
    }
}
