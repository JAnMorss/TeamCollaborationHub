using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TeamHub.API.Abstractions;
using TeamHub.API.Controllers.Users;
using TeamHub.Application.Users.Commands.DemoteUserToUser;
using TeamHub.Application.Users.Commands.PromoteUserToAdmin;
using TeamHub.Application.Users.Commands.UpdateDetails;
using TeamHub.Application.Users.Responses;
using TeamHub.SharedKernel;

namespace TeamHub.API.Controllers.AdminUser;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUserController : ApiController
{
    public AdminUserController(ISender sender) 
        : base(sender)
    {
    }

    [HttpPut("{id:Guid}/details")]
    public async Task<IActionResult> UpdateAdminUserDetails(
        [FromRoute] Guid id,
        [FromBody] UserRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateDetailsCommand(
            id,
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

    [HttpPost("{userId:Guid}/promote")]
    public async Task<IActionResult> PromoteUserToAdmin(
        [FromRoute] Guid userId,
        CancellationToken cancellationToken)
    {
        var command = new PromoteUserToAdminCommand(userId);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok("User promoted to Admin successfully")
            : HandleFailure(result);
    }

    [HttpPost("{userId:Guid}/demote")]
    public async Task<IActionResult> DemoteUserToUser(
        [FromRoute] Guid userId,
        CancellationToken cancellationToken)
    {
        var command = new DemoteUserToUserCommand(userId);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok("User demoted to User successfully")
            : HandleFailure(result);
    }
}
