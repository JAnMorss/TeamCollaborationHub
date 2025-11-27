using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Auth.Commands.ForgotPassword;

public sealed record ForgotPasswordCommand(
    string Email,
    string ClientUrl) : ICommand;
