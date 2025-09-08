using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TeamHub.API.Controllers.Users;
using TeamHub.Application.Users.Commands.UpdateDetails;

namespace TeamHub.API.Controllers.AdminUser;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUserController : ControllerBase
{
    private readonly ISender _sender;

    public AdminUserController(ISender sender) 
        => _sender = sender;

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
            ? Ok(result.Value)
            : BadRequest(result.Error);
    }
}
