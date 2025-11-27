using TeamHub.Application.Abstractions;
using TeamHub.Domain.Users.Errors;
using TeamHub.Domain.Users.Interface;
using TeamHub.Domain.Users.ValueObjects;
using TeamHub.EmailService.Abstractions;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Auth.Commands.ForgotPassword;

public sealed class ForgotPasswordCommandHandler : ICommandHandler<ForgotPasswordCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordResetTokenProvider _tokenProvider;
    private readonly IEmailSender _emailSender;

    public ForgotPasswordCommandHandler(
        IUserRepository userRepository, 
        IPasswordResetTokenProvider tokenProvider, 
        IEmailSender emailSender)
    {
        _userRepository = userRepository;
        _tokenProvider = tokenProvider;
        _emailSender = emailSender;
    }

    public async Task<Result> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var emailResult = EmailAddress.Create(request.Email);
        if (emailResult.IsFailure)
            return Result.Failure(emailResult.Error);

        var user = await _userRepository.GetByEmailAsync(emailResult.Value, cancellationToken);
        if (user is null)
            return Result.Success();

        var tokenResult = _tokenProvider.GenerateToken(user);

        var link = $"{request.ClientUrl}/reset-password?email={request.Email}&token={Uri.EscapeDataString(tokenResult)}";

        await _emailSender.SendEmailAsync(
            user.Email.Value,
            "Reset your password",
            $"<p>Click below to reset your password:</p><a href='{link}'>Reset Password</a>");

        return Result.Success();
    }
}
