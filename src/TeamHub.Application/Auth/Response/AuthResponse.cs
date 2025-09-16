using TeamHub.Application.Users.Responses;

namespace TeamHub.Application.Auth.Response;

public sealed class AuthResponse
{
    public string Token { get; init; } = string.Empty;

    //public UserResponse User { get; init; } = default!;

    public AuthResponse(string token)
    {
        Token = token;
    }

    //public AuthResponse(string token, UserResponse user)
    //{
    //    Token = token;
    //    User = user;
    //}

}
