using TeamHub.Application.Abstractions;
using TeamHub.Domain.Users.Errors;
using TeamHub.Domain.Users.Interface;
using TeamHub.Domain.Users.ValueObjects;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Auth.Commands.ResetPassword;

public sealed class ResetPasswordCommandHandler : ICommandHandler<ResetPasswordCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordResetTokenProvider _tokenProvider;
    private readonly IUnitOfWork _unitOfWork;

    public ResetPasswordCommandHandler(
        IUserRepository userRepository,
        IPasswordResetTokenProvider tokenProvider,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _tokenProvider = tokenProvider;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var emailResult = EmailAddress.Create(request.Email);
        if (emailResult.IsFailure)
            return Result.Failure(emailResult.Error);

        var user = await _userRepository.GetByEmailAsync(emailResult.Value, cancellationToken);
        if (user is null)
            return Result.Failure(UserErrors.InvalidResetRequest);

        var tokenValid = _tokenProvider.ValidateToken(user, request.Token);
        if (!tokenValid)
            return Result.Failure(UserErrors.InvalidResetToken);

        user.ChangePassword(request.NewPassword);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
