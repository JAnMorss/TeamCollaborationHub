using FluentAssertions;
using TeamHub.Domain.Users.ValueObjects;

namespace TeamHub.DomainUnitTests.Users.ValueObjects;

public class EmailAddressTests
{
    [Fact]
    public void Create_Should_ReturnSuccess_For_ValidEmail()
    {
        // Arrange
        var email = "test.user@gmail.com";

        // Act
        var result = EmailAddress.Create(email);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(email.ToLower());
    }

    [Fact]
    public void Create_Should_ReturnFailure_For_EmptyEmail()
    {
        // Arrange
        var email = "";

        // Act
        var result = EmailAddress.Create(email);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Email.Empty");
        result.Error.Message.Should().Be("EmailAddress cannot be empty.");
    }

    [Fact]
    public void Create_Should_ReturnFailure_For_InvalidEmail()
    {
        // Arrange
        var invalidEmail = "not-an-email";

        // Act
        var result = EmailAddress.Create(invalidEmail);

        // Arrange
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Email.Invalid");
        result.Error.Message.Should().Be("Invalid email address format.");
    }

    [Fact]
    public void GetAtomicValues_Should_Return_Email_Value()
    {
        // Arrange
        var vo = EmailAddress.Create("test@example.com").Value;

        // Act
        var atomicValues = vo.GetAtomicValues().ToList();

        // Assert
        atomicValues.Should().ContainSingle()
                    .And.Contain("test@example.com");
    }

    [Fact]
    public void ToString_Should_Return_Email_Value()
    {
        // Arrange
        var emailAddress = EmailAddress.Create("user@example.com").Value;

        // Act
        var str = emailAddress.ToString();

        // Assert
        str.Should().Be("user@example.com");
    }

    [Fact]
    public void Equals_Should_Return_True_For_Same_Email()
    {
        // Arrange
        var a = EmailAddress.Create("test@example.com").Value;
        var b = EmailAddress.Create("test@example.com").Value;

        // Act
        var equals = a.Equals(b);

        // Assert
        equals.Should().BeTrue();
    }

    [Fact]
    public void Equals_Should_Return_False_For_Different_Email()
    {
        // Arrange
        var a = EmailAddress.Create("test@example.com").Value;
        var b = EmailAddress.Create("other@example.com").Value;

        // Act
        var equals = a.Equals(b);

        // Assert
        equals.Should().BeFalse();
    }
}
