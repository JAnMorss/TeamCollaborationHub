namespace TeamHub.API.Controllers.Auth;

public record LoginRequest(
    string Email,
    string Password);