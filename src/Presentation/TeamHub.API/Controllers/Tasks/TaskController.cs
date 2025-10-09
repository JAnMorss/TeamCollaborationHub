using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TeamHub.API.Abstractions;
using TeamHub.Application.Tasks.Queries.GetAllTasks;
using TeamHub.Application.Tasks.Queries.GetTaskById;
using TeamHub.Application.Tasks.Queries.GetTasksByProjectId;
using TeamHub.Application.Tasks.Responses;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.PageSize;

namespace TeamHub.API.Controllers.Tasks;

[ApiController]
[Route("api/task")]
[Authorize]
public class TaskController : ApiController
{
    public TaskController(ISender sender) : base(sender)
    {
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAllTasks(
        [FromQuery] QueryObject queryObject,
        CancellationToken cancellationToken)
    {
        var query = new GetAllTasksQuery(queryObject);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<TaskResponse>>(
                result.Value,
                "Task fetched successfully"))
            : HandleFailure(result);
    }

    [AllowAnonymous]
    [HttpGet("{id:Guid}")]
    public async Task<IActionResult> GetTaskById(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var query = new GetTaskByIdQuery(id);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<TaskResponse>(
                result.Value,
                "Task fetched successfully"))
            : HandleFailure(result);
    }

    [AllowAnonymous]
    [HttpGet("by-project/{projectId:guid}")]
    public async Task<IActionResult> GetTaskByProjectId(
        [FromRoute] Guid projectId,
        CancellationToken cancellationToken)
    {
        var query = new GetTasksByProjectIdQuery(projectId);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<IEnumerable<TaskResponse>>(
                result.Value,
                "Tasks by project ID fetched successfully"))
            : HandleFailure(result);
    }
}
