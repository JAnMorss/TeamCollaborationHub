namespace TeamHub.API.Controllers.Auth.Requests;

public sealed record ForgotPasswordRequest(
    string Email, 
    string ClientUrl);
