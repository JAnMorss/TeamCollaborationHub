using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TeamHub.API.Abstractions;
using TeamHub.Application.Notifications.Queries.GetAllNotifications;
using TeamHub.Application.Notifications.Responses;
using TeamHub.SharedKernel;

namespace TeamHub.API.Controllers.Notifications;

[Authorize]
[ApiController]
[ApiVersion(ApiVersions.V1)]
[Route("api/v{version:apiVersion}/notification")]
public class NotificationsController : ApiController
{
    public NotificationsController(ISender sender) 
        : base(sender)
    {
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications(
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();
        var query = new GetAllNotificationsQuery(userId.Value);
        var result = await _sender.Send(query, cancellationToken);
        return result.IsSuccess
            ? Ok(new ApiResponse<List<NotificationResponse>>(
                result.Value,
                "Notifications fetched successfully"))
            : HandleFailure(result);
    }
}
