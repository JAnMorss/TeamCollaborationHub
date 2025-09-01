using TeamHub.Domain.Users.Errors;
using TeamHub.Domain.Users.Interface;
using TeamHub.SharedKernel.ErrorHandling;
using TeamHub.SharedKernel.Messaging.Command;

namespace TeamHub.Application.Users.Commands.UpdateAvatar;

public sealed class UpdateAvatarCommandHandler : ICommandHandler<UpdateAvatarCommand>
{
    private readonly IUserRepository _userRepository;

    public UpdateAvatarCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result> Handle(
        UpdateAvatarCommand request, 
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
            return Result.Failure(UserErrors.NotFound);

        var result = user.UpdateAvatar(request.AvatarUrl);
        if (result.IsFailure)
            return result;

        await _userRepository.UpdateAsync(user, cancellationToken);

        return Result.Success();
    }
}
