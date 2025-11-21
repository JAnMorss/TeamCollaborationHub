using FluentAssertions;
using TeamHub.Domain.Users.ValueObjects;

namespace TeamHub.DomainUnitTests.Users.ValueObjects;

public class LastNameTests
{
    [Fact]
    public void Create_Should_ReturnSuccess_For_ValidLastName()
    {
        // Arrange
        var validLastName = "Morales";

        // Act
        var result = LastName.Create(validLastName);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(validLastName);
    }

    [Fact]
    public void Create_Should_ReturnFailure_For_EmptyLastName()
    {
        // Arrange
        var invalidName = "";

        // Act
        var result = LastName.Create(invalidName);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("LastName.Empty");
        result.Error.Message.Should().Be("Lastname cannot be empty.");
    }

    [Fact]
    public void Create_Should_ReturnFailure_For_TooLongLastName()
    {
        // Arrange
        var longName = new string('A', LastName.MaxLength + 1);

        // Act
        var result = LastName.Create(longName);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("LastName.TooLong");
        result.Error.Message.Should().Be(
            $"Lastname is too long. Maximum length is {LastName.MaxLength} characters."
        );
    }


    [Fact]
    public void GetAtomicValues_Should_Return_LastName_Values()
    {
        // Arrange
        var vo = LastName.Create("Morales").Value;

        // Act
        var atomicValues = vo.GetAtomicValues().ToList();

        // Assert
        atomicValues.Should().ContainSingle().And.Contain("Morales");
    }
}
