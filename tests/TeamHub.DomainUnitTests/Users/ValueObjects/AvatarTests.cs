using FluentAssertions;
using TeamHub.Domain.Users.ValueObjects;

namespace TeamHub.DomainUnitTests.Users.ValueObjects;

public class AvatarTests
{
    [Fact]
    public void Create_Should_ReturnSuccess_For_ValidUrl()
    {
        // Arrange
        var url = "https://example.com/avatar.png";

        // Act
        var result = Avatar.Create(url);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(url);
    }

    [Theory]
    [InlineData("invalid-url")]
    [InlineData("ftp://example.com/avatar.png")]
    [InlineData("http:/example.com")]
    [InlineData("")]
    public void Create_Should_ReturnFailure_For_InvalidUrl(string invalidUrl)
    {
        // Act
        var result = Avatar.Create(invalidUrl);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Avatar.InvalidUrl");
        result.Error.Message.Should().Be("Invalid avatar URL.");
    }

    [Fact]
    public void ExtractFileIdFromUrl_Should_Return_Guid_When_LastSegmentIsGuid()
    {
        // Arrange
        var id = Guid.NewGuid();
        var url = $"https://example.com/avatars/{id}";

        // Act
        var extractedFileId = Avatar.ExtractFileIdFromUrl(url);

        // Assert
        extractedFileId.Should().Be(id);
    }

    [Fact]
    public void ExtractFileIdFromUrl_Should_Return_Null_When_LastSegmentIsNotGuid()
    {
        // Arrange
        var url = "https://example.com/avatars/not-a-guid";

        // Act
        var extractedFileId = Avatar.ExtractFileIdFromUrl(url);

        // Assert
        extractedFileId.Should().BeNull();
    }

    [Fact]
    public void ExtractfileIdFromUrl_Should_Return_Null_When_UrlIsInvalid()
    {
        // Arrange
        var invalidUrl = "ht!tp:/invalid";

        // Act
        var extractedFileId = Avatar.ExtractFileIdFromUrl(invalidUrl);

        // Assert
        extractedFileId.Should().BeNull();
    }

    [Fact]
    public void GetAtomicValues_Should_Return_Avatar_Value()
    {
        // Arrange
        var avatar = Avatar.Create("https://example.com/avatar.png").Value;

        // Act
        var atomicValues = avatar.GetAtomicValues().ToList();

        // Assert
        atomicValues.Should().ContainSingle().And.Contain("https://example.com/avatar.png");
    }

    [Fact]
    public void ToString_Should_Return_Url_Value()
    {
        // Arrange
        var url = "https://example.com/avatar.png";
        var avatar = Avatar.Create(url).Value;

        // Act
        var str = avatar.ToString();

        // Assert
        str.Should().Be(url);
    }
}
