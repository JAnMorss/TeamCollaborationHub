using TeamHub.Domain.Users.Entities;

namespace TeamHub.Application.Abstractions;

public interface IPasswordResetTokenProvider
{
    string GenerateToken(User user);
    bool ValidateToken(User user, string token);
}
