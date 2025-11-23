using FluentAssertions;
using TeamHub.Domain.Users.ValueObjects;

namespace TeamHub.DomainUnitTests.Users.ValueObjects;

public class PasswordHashTests
{
    [Fact]
    public void FromPlainText_Should_Generate_Valid_Hash()
    {
        // Arrange
        var password = "MyStrongP@ssw0rd123!";

        // Act
        var hash = PasswordHash.FromPlainText(password);

        // Assert
        hash.Value.Should().NotBeNullOrEmpty();
        hash.Value.Should().Contain(".");
        hash.Value.Split('.').Length.Should().Be(2);
    }

    [Fact]
    public void Verify_Should_ReturnFalse_For_IncorrectPassword()
    {
        // Arrange
        var password = "CorrectPassword123!";
        var hash = PasswordHash.FromPlainText(password);

        // Act
        var result = hash.Verify(password);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void Create_Should_ReturnSuccess_For_ValidHash()
    {
        // Arrange
        var hash = PasswordHash.FromPlainText("Password!").Value;

        // Act
        var result = PasswordHash.Create(hash);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(hash);
    }

    [Fact]
    public void Create_Should_ReturnFailure_For_EmptyHash()
    {
        // Arrange 
        var hash = "";

        // Act
        var result = PasswordHash.Create(hash);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("PasswordHash.Empty");
        result.Error.Message.Should().Be("Password hash cannot be empty.");
    }

    [Fact]
    public void Create_Should_ReturnFailure_For_InvalidHash()
    {
        // Arrange 
        var invalidHash = "assd";

        // Act
        var result = PasswordHash.Create(invalidHash);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("PasswordHash.Invalid");
        result.Error.Message.Should().Be("Password hash format is invalid or too short.");
    }

    [Fact]
    public void GetAtomicValues_Should_Return_PasswordHash_Value()
    {
        // Arrange
        var vo = PasswordHash.FromPlainText("MyPassword123!");

        // Act
        var values = vo.GetAtomicValues().ToList();

        // Assert
        values.Should().ContainSingle().And.Contain(vo.Value);
    }

    [Fact]
    public void ToString_Should_Return_Hash_String()
    {
        // Arrange
        var hash = PasswordHash.FromPlainText("StrongPassword");

        // Act
        var str = hash.ToString();

        // Assert
        str.Should().Be(hash.Value);
    }
}
