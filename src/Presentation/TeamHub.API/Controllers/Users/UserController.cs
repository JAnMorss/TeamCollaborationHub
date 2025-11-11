using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TeamHub.API.Abstractions;
using TeamHub.Application.Users.Commands.ActiveUser;
using TeamHub.Application.Users.Commands.DeactivateUser;
using TeamHub.Application.Users.Commands.UpdateDetails;
using TeamHub.Application.Users.Commands.UpdateUserAvatar;
using TeamHub.Application.Users.Queries.GetAllUsers;
using TeamHub.Application.Users.Queries.GetMyProfile;
using TeamHub.Application.Users.Queries.GetUserAvatar;
using TeamHub.Application.Users.Queries.SearchUsersByName;
using TeamHub.Application.Users.Responses;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.PageSize;

namespace TeamHub.API.Controllers.Users;

[ApiController]
[ApiVersion(ApiVersions.V1)]
[Authorize]
[Route("api/v{version:apiVersion}/users")]
public class UserController : ApiController
{
    public UserController(ISender sender)
        : base(sender)
    {
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var query = new GetMyProfileQuery(userId.Value);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<UserResponse>(
                    result.Value, 
                    "Profile fetched successfully"))
            : HandleFailure(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers(
        [FromQuery] QueryObject queryObject,
        CancellationToken cancellationToken)
    {
        var query = new GetAllUsersQuery(queryObject);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<UserResponse>>(
                result.Value,
                "Users fetched successfully"))
            : HandleFailure(result);
    }

    [HttpGet("searchUsers")]
    public async Task<IActionResult> SearchUsersByName(
        [FromQuery] string name,
        [FromQuery] QueryObject queryObject,
        CancellationToken cancellationToken)
    {
        var query = new SearchUsersByNameQuery(name, queryObject);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<UserResponse>>(
                result.Value,
                "Users fetched successfully"))
            : HandleFailure(result);
    }

    [HttpPut("activate")]
    public async Task<IActionResult> ActivateUser(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new ActivateUserCommand(userId.Value);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("User activated successfully"))
            : HandleFailure(result);
    }

    [HttpPut("deactivate")]
    public async Task<IActionResult> DeactivateUser(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new DeactivateUserCommand(userId.Value);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("User deactivated successfully"))
            : HandleFailure(result);
    }

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

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<UserResponse>(
                result.Value, 
                "User details updated successfully"))
            : HandleFailure(result);
    }

    [HttpGet("avatar")]
    public async Task<IActionResult> GetUserAvatar(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var query = new GetUserAvatarQuery(userId.Value);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<UserAvatarResponse>(
                result.Value,
                "User Avatar fetched successfully"))
            : HandleFailure(result);
    }

    [HttpPut("updateAvatar")]
    public async Task<IActionResult> UpdateUserAvatar(
        [FromForm] UpdateAvatarRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new UpdateUserAvatarCommand(userId.Value, request.File);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("User avatar updated successfully"))
            : HandleFailure(result);
    }
}
