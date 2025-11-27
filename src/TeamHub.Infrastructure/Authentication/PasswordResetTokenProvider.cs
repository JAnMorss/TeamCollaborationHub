using System.Collections.Concurrent;
using TeamHub.Application.Abstractions;
using TeamHub.Domain.Users.Entities;

namespace TeamHub.Infrastructure.Authentication;

public class PasswordResetTokenProvider : IPasswordResetTokenProvider
{
    private static readonly ConcurrentDictionary<Guid, string> _tokens = new();
    public string GenerateToken(User user)
    {
        var token = Guid.NewGuid().ToString();
        _tokens[user.Id] = token;

        return token;
    }

    public bool ValidateToken(User user, string token)
    {
        return _tokens.TryGetValue(user.Id, out var storedToken) && storedToken == token;
    }
}
