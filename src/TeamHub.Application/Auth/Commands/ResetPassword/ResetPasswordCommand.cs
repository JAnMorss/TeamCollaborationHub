using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Auth.Commands.ResetPassword;

public sealed record ResetPasswordCommand(
    string Email, 
    string Token,
    string NewPassword) : ICommand;
