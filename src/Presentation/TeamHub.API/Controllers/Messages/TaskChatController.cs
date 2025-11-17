using MediatR;
using TeamHub.API.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using TeamHub.Application.Messages.Commands;
using TeamHub.SharedKernel;

namespace TeamHub.API.Controllers.Messages;

[ApiController]
[ApiVersion(ApiVersions.V1)]
[Authorize]
[Route("api/v{version:apiVersion}/chat")]
public class TaskChatController : ApiController
{
    public TaskChatController(ISender sender) 
        : base(sender)
    {
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage(
        [FromBody] SendTaskMessageRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new SendTaskMessageCommand(
            request.TaskId,
            userId.Value,
            request.Message);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<Guid>(
                result.Value,
                "Message sent successfully."))
            : HandleFailure(result);
    }
}
