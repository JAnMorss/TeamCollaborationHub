using FluentAssertions;
using TeamHub.Domain.Projects.ValueObjects;

namespace TeamHub.DomainUnitTests.Projects.ValueObjects;

public class ProjectColorTests
{
    [Fact]
    public void Create_Should_Return_Success_When_Color_Is_Valid()
    {
        // Arrange
        var color = "#FF5733";

        // Act
        var result = ProjectColor.Create(color);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(color);
    }

    [Fact]
    public void Create_Should_Return_Success_When_Valid_3_Digit_Hex_Color()
    {
        // Arrange
        var color = "#F53";

        // Act
        var result = ProjectColor.Create(color);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(color);
    }

    [Fact]
    public void Create_Should_Return_Failure_When_Color_Is_Empty()
    {
        // Arrange
        var emptyColor = "";

        // Act
        var result = ProjectColor.Create(emptyColor);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("ProjectColor.Empty");
        result.Error.Message.Should().Be("Project color cannot be empty.");
    }

    [Theory]
    [InlineData("FFFFFF")]      
    [InlineData("#FFFFF")]      
    [InlineData("#FFFFFZZ")] 
    [InlineData("#1234")]    
    [InlineData("#12")]  
    [InlineData("#12345G")]     
    [InlineData("#XYZ")]
    public void Create_Should_Return_Failure_When_Color_Is_Invalid_Hex(string color)
    {
        // Act
        var result = ProjectColor.Create(color);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("ProjectColor.Invalid");
        result.Error.Message.Should().Be("Project color must be a valid HEX code (e.g., #FFFFFF).");
    }
}
