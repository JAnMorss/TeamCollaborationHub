using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Domain.Users.Entities;

public sealed class RefreshToken
{
    public RefreshToken(
        Guid userId, 
        string token, 
        DateTime expiryDate) 
    {
        UserId = userId;
        Token = token;
        ExpiryDate = expiryDate;
        IsRevoked = false;
    }

    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Token {  get; private set; } = null!;
    public DateTime ExpiryDate { get; private set; }
    public bool IsRevoked { get; private set; }
    public User User { get; private set; } = null!;


    public bool IsExpired()
        => DateTime.UtcNow >= ExpiryDate;

    public void Revoke()
        => IsRevoked = true;
}
