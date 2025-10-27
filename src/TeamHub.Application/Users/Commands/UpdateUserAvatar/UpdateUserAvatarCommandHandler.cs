using TeamHub.Domain.Users.Errors;
using TeamHub.Domain.Users.Interface;
using TeamHub.Domain.Users.ValueObjects;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;
using TeamHub.SharedKernel.Storage;

namespace TeamHub.Application.Users.Commands.UpdateUserAvatar;

public sealed class UpdateUserAvatarCommandHandler : ICommandHandler<UpdateUserAvatarCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAvatarBlobService _avatarBlobService;
    public UpdateUserAvatarCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IAvatarBlobService avatarBlobService)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _avatarBlobService = avatarBlobService;
    }
    public async Task<Result> Handle(UpdateUserAvatarCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
            return Result.Failure(UserErrors.NotFound);

        if (user.Avatar is not null)
        {
            var oldFileId = Avatar.ExtractFileIdFromUrl(user.Avatar.Value);
            if (oldFileId.HasValue)
                await _avatarBlobService.DeleteAsync(oldFileId.Value);
        }

        using var stream = request.File.OpenReadStream();
        var newFileId = await _avatarBlobService.UploadAsync(
                stream,
                request.File.ContentType,
                cancellationToken);

        var newAvatarUrl = _avatarBlobService.GetBlobUri(newFileId);

        var avatarResult = user.UpdateAvatar(newAvatarUrl);
        if(avatarResult.IsFailure)
            return Result.Failure(avatarResult.Error);

        await _userRepository.UpdateAsync(user, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }


}
