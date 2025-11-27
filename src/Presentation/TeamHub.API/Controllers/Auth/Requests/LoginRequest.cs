namespace TeamHub.API.Controllers.Auth.Requests;

public record LoginRequest(
    string Email,
    string Password);