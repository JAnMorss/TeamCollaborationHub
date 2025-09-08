using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using TeamHub.SharedKernel.Domain;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Users.ValueObjects;

public sealed class PasswordHash : ValueObject
{
    public string Value { get; }

    private PasswordHash(string value)
    {
        Value = value;
    }

    public static PasswordHash FromPlainText(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Password cannot be empty.", nameof(password));

        byte[] salt = RandomNumberGenerator.GetBytes(16); 
        string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 10000,
            numBytesRequested: 32));

        return new PasswordHash($"{Convert.ToBase64String(salt)}.{hashed}");
    }

    public bool Verify(string password)
    {
        var parts = Value.Split('.');
        if (parts.Length != 2) return false;

        var salt = Convert.FromBase64String(parts[0]);
        var storedHash = parts[1];

        string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 10000,
            numBytesRequested: 32));

        return storedHash == hashed;
    }

    public static Result<PasswordHash> Create(string hash)
    {
        if (string.IsNullOrWhiteSpace(hash))
        {
            return Result.Failure<PasswordHash>(new Error(
                "PasswordHash.Empty",
                "Password hash cannot be empty."));
        }

        if (hash.Length < 20)
        {
            return Result.Failure<PasswordHash>(new Error(
                "PasswordHash.Invalid",
                "Password hash format is invalid or too short."));
        }

        return new PasswordHash(hash);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString() 
        => Value;
}
