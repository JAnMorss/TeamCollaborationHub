using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TeamHub.API.Abstractions;
using TeamHub.Application.Tasks.Commands.AssignTask;
using TeamHub.Application.Tasks.Commands.CreateTask;
using TeamHub.Application.Tasks.Commands.DeleteTask;
using TeamHub.Application.Tasks.Commands.UnassignTask;
using TeamHub.Application.Tasks.Commands.UpdateTask;
using TeamHub.Application.Tasks.Queries.GetAllTasks;
using TeamHub.Application.Tasks.Queries.GetTaskById;
using TeamHub.Application.Tasks.Queries.GetTasksByAssignedUser;
using TeamHub.Application.Tasks.Queries.GetTasksByProjectId;
using TeamHub.Application.Tasks.Responses;
using TeamHub.Application.Tasks.TaskAttachments.Commands.RemoveTaskAttachment;
using TeamHub.Application.Tasks.TaskAttachments.Commands.UploadTaskAttachment;
using TeamHub.Application.Tasks.TaskAttachments.Queries.DownloadTaskAttachment;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.PageSize;

namespace TeamHub.API.Controllers.Tasks;

[ApiController]
[ApiVersion(ApiVersions.V1)]
[Route("api/v{version:apiVersion}/task")]
[Authorize]
public class TaskController : ApiController
{
    public TaskController(ISender sender) : base(sender)
    {
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTasks(
        [FromQuery] QueryObject queryObject,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var query = new GetAllTasksQuery(queryObject, userId.Value);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<TaskResponse>>(
                result.Value,
                "Task fetched successfully"))
            : HandleFailure(result);
    }

    [HttpGet("{id:guid}")]
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

    [HttpGet("by-project/{projectId:Guid}")]
    public async Task<IActionResult> GetTaskByProjectId(
        [FromRoute] Guid projectId,
        CancellationToken cancellationToken)
    {
        var query = new GetTasksByProjectIdQuery(projectId);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<IEnumerable<TaskResponse>>(
                result.Value,
                result.Value.Any()
                    ? "Tasks by project ID fetched successfully"
                    : "This project has no tasks yet. Add some tasks first."))
            : HandleFailure(result);
    }

    [HttpGet("assigned")]
    public async Task<IActionResult> GetTaskByAssignedUser(
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var query = new GetTasksByAssignedUserQuery(userId.Value);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<IEnumerable<TaskResponse>>(
                result.Value,
                result.Value.Any()
                    ? "Tasks assigned to you were fetched successfully."
                    : "You currently have no assigned tasks."))
            : HandleFailure(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(
        [FromBody] TaskRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null) 
            return Unauthorized();

        var command = new CreateTaskCommand(
            request.ProjectId,
            userId.Value,
            request.Title,
            request.Description,
            request.Priority,
            request.Status,
            request.DueDate);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<TaskResponse>(
                result.Value,
                "Task Create successfully"))
            : HandleFailure(result);
    }

    [HttpPut("{id:guid}/details")]
    public async Task<IActionResult> UpdateTask(
        [FromRoute] Guid id,
        [FromBody] TaskRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new UpdateTaskCommand(
            id,
            request.Title,
            request.Description,
            request.Priority,
            request.Status,
            request.DueDate,
            userId.Value);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<TaskResponse>(
                result.Value,
                "Task updated successfully"))
            : HandleFailure(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTask(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new DeleteTaskCommand(id, userId.Value);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
           ? Ok(new ApiResponse("The task was deleted successfully."))
           : HandleFailure(result);
    }

    [HttpPut("{taskId:guid}/assign")]
    public async Task<IActionResult> AssignTask(
        [FromRoute] Guid taskId,
        [FromBody] AssignTaskRequest request,
        CancellationToken cancellationToken)
    {
        var command = new AssignTaskCommand(taskId, request.UserId);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("Task assigned successfully"))
            : HandleFailure(result);
    }

    [HttpPut("{taskId:guid}/unassign")]
    public async Task<IActionResult> UnassignTask(
        Guid taskId,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new UnassignTaskCommand(taskId, userId.Value);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("Unassign task successfully"))
            : HandleFailure(result);
    }

    [HttpPost("{taskId}/attachments/upload")]
    public async Task<IActionResult> UploadAttachment(
        [FromRoute] Guid taskId,
        [FromForm] UploadAttachmentRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null) 
            return Unauthorized();

        if (request.File is null || request.File.Length == 0)
            return BadRequest(new ApiResponse<string>(null, "File is required."));

        var command = new UploadTaskAttachmentCommand(taskId, userId.Value, request.File);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
             ? Ok(new ApiResponse<TaskAttachmentResponse>(
                 result.Value, 
                 "File uploaded successfully."))
             : HandleFailure(result);

    }

    [HttpGet("attachments/{attachmentId:guid}/download")]
    public async Task<IActionResult> DownloadAttachment(
        [FromRoute] Guid attachmentId,
        CancellationToken cancellationToken)
    {
        var query = new DownloadTaskAttachmentQuery(attachmentId);

        var result = await _sender.Send(query, cancellationToken);

        var file = result.Value;

        return File(
            file.Stream, 
            file.ContentType, 
            file.FileName
        );
    }

    [HttpDelete("attachments/{attachmentId:guid}/remove")]
    public async Task<IActionResult> RemoveAttachment(
        [FromRoute] Guid attachmentId,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new RemoveTaskAttachmentCommand(attachmentId, userId.Value);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("Deleted successfully."))
            : HandleFailure(result);
    }
}
