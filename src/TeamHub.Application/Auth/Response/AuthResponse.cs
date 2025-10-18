namespace TeamHub.Application.Auth.Response;

public sealed class AuthResponse
{
    public string Token { get; init; }
    public string RefreshToken { get; init; }

    public AuthResponse(
        string token, 
        string refreshToken)
    {
        Token = token;
        RefreshToken = refreshToken;
    }
}
