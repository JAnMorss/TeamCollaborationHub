namespace TeamHub.API.Controllers.Auth.Requests;

public sealed record ResetPasswordRequest(
    string Email,
    string Token, 
    string NewPassword);
