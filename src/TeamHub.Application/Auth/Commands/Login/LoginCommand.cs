using TeamHub.Application.Auth.Response;
using TeamHub.SharedKernel.Messaging.Command;

namespace TeamHub.Application.Auth.Commands.Login;

public sealed record LoginCommand(
    string Email,
    string Password) : ICommand<AuthResponse>;
