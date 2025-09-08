using TeamHub.Application.Users.Responses;
using TeamHub.SharedKernel.Messaging.Command;

namespace TeamHub.Application.Users.Commands.UpdateDetails;

public sealed record UpdateDetailsCommand(
    Guid Id,
    string FirstName,
    string LastName,
    string Email) : ICommand<UserResponse>;
