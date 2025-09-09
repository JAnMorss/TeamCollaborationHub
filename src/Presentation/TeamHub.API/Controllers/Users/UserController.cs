using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TeamHub.API.Abstractions;
using TeamHub.Application.Users.Commands.ActiveUser;
using TeamHub.Application.Users.Commands.DeactivateUser;
using TeamHub.Application.Users.Commands.UpdateDetails;
using TeamHub.Application.Users.Queries.GetMyProfile;
using TeamHub.Application.Users.Responses;

namespace TeamHub.API.Controllers.Users;

[ApiController]
[Route("api/user")]
public class UserController : ApiController
{
    public UserController(ISender sender)
        : base(sender)
    {
    }

    protected Guid? GetUserId()
    {
        var userId = User.FindFirst("sub")?.Value;
        return string.IsNullOrEmpty(userId) 
            ? null 
            : Guid.Parse(userId);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var query = new GetMyProfileQuery(userId.Value);

        var result = await _sender.Send(
            query, 
            cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<UserResponse>(
                    result.Value, 
                    "Profile fetched successfully"))
            : HandleFailure(result);
    }

    [Authorize]
    [HttpPut("activate")]
    public async Task<IActionResult> ActivateUser(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new ActivateUserCommand(userId.Value);

        var result = await _sender.Send(
            command, 
            cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("User activated successfully"))
            : HandleFailure(result);
    }

    [Authorize]
    [HttpPut("deactivate")]
    public async Task<IActionResult> DeactivateUser(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new DeactivateUserCommand(userId.Value);

        var result = await _sender.Send(
            command, 
            cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("User deactivated successfully"))
            : HandleFailure(result);
    }

    [Authorize]
    [HttpPut("details")]
    public async Task<IActionResult> UserUpdateDetails(
        [FromBody] UserRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new UpdateDetailsCommand(
            userId.Value,
            request.FirstName,
            request.LastName,
            request.Email);

        var result = await _sender.Send(
            command, 
            cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<UserResponse>(
                    result.Value, 
                    "User details updated successfully"))
            : HandleFailure(result);
    }
}
