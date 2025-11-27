namespace TeamHub.API.Controllers.Auth.Requests;

public sealed record RegisterRequest(
    string FirstName,
    string LastName,
    string Email,
    string Password);
