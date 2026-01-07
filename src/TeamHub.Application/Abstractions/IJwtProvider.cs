using TeamHub.Domain.Users.Entities;

namespace TeamHub.Application.Abstractions;

public interface IJwtProvider
{
    string Generate(User user);

    string GenerateRefreshToken();
}
