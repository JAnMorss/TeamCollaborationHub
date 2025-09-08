namespace TeamHub.API.Controllers.Users;

public record LoginRequest(
    string Email,
    string Password);