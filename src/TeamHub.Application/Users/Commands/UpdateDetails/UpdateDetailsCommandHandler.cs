using TeamHub.Application.Users.Responses;
using TeamHub.Domain.Users.Errors;
using TeamHub.Domain.Users.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Users.Commands.UpdateDetails;

public sealed class UpdateDetailsCommandHandler : ICommandHandler<UpdateDetailsCommand, UserResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
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
            return Result.Failure<UserResponse>(UserErrors.NotFound);

        var updateResult = existingUser.UpdateDetails(
            request.FirstName,
            request.LastName,
            request.Email
        );

        if (updateResult.IsFailure)
            return Result.Failure<UserResponse>(updateResult.Error);

        await _userRepository.UpdateAsync(existingUser, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var result = UserResponse.FromEntity(existingUser);

        return Result.Success(result);
    }
}
