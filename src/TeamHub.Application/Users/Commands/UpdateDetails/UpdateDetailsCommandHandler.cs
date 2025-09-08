using TeamHub.Application.Users.Responses;
using TeamHub.Domain.Users.Interface;
using TeamHub.Domain.Users.ValueObjects;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.ErrorHandling;
using TeamHub.SharedKernel.Messaging.Command;

namespace TeamHub.Application.Users.Commands.UpdateDetails;

public sealed class UpdateDetailsCommandHandler : ICommandHandler<UpdateDetailsCommand, UserResponse>
{
    public readonly IUserRepository _userRepository;
    public readonly IUnitOfWork _unitOfWork;

    public UpdateDetailsCommandHandler(
        IUserRepository userRepository, 
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<UserResponse>> Handle(UpdateDetailsCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await _userRepository.GetByIdAsync(request.Id, cancellationToken);
        if (existingUser is null)
            return Result.Failure<UserResponse>(new Error(
                "User.NotFound",
                "User cannot be found"));

        existingUser.UpdateDetails(
            new FirstName(request.FirstName).Value,
            new LastName(request.LastName).Value,
            new EmailAddress(request.Email).Value
        );

        await _userRepository.UpdateAsync(existingUser, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var result = UserResponse.FromEntity(existingUser);

        return Result.Success(result);
    }
}
