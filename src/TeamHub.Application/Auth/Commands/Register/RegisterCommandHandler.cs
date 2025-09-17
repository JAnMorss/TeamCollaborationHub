using TeamHub.Domain.Users.Entities;
using TeamHub.Domain.Users.Interface;
using TeamHub.SharedKernel;
using TeamHub.Application.Abstractions;
using TeamHub.Application.Auth.Response;
using TeamHub.Application.Users.Responses;
using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.Users.ValueObjects;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.Application.Auth.Commands.Register;

public sealed class RegisterCommandHandler : ICommandHandler<RegisterCommand, UserResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtProvider _jwtProvider;
    private readonly IUnitOfWork _unitOfWork;

    public RegisterCommandHandler(
        IUserRepository userRepository,
        IJwtProvider jwtProvider,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _jwtProvider = jwtProvider;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<UserResponse>> Handle(
    RegisterCommand request,
    CancellationToken cancellationToken)
    {
        var passwordHash = PasswordHash.FromPlainText(request.Password);

        var userResult = User.Create(
            Guid.NewGuid(),
            request.FirstName,
            request.LastName,
            request.Email,
            request.Avatar,
            passwordHash.Value 
        );

        if (userResult.IsFailure)
            return Result.Failure<UserResponse>(userResult.Error);

        var user = userResult.Value;

        var token = _jwtProvider.Generate(user);

        await _userRepository.AddAsync(user, cancellationToken);

        try
        {
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException ex)
        {
            Console.WriteLine(ex.InnerException?.Message);
            throw;
        }

        return Result.Success(UserResponse.FromEntity(user));
    }

}

