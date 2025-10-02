using TeamHub.Application.Users.Responses;
using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Auth.Commands.Register;

public sealed record RegisterCommand(
    string FirstName,
    string LastName,
    string Email,
    string Avatar,
    string Password) : ICommand<UserResponse>;