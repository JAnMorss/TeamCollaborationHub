using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TeamHub.API.Abstractions;
using TeamHub.API.Controllers.Projects.Requests;
using TeamHub.Application.Projects.Commands.Createproject;
using TeamHub.Application.Projects.Commands.DeleteProject;
using TeamHub.Application.Projects.Commands.UpdateProject;
using TeamHub.Application.Projects.ProjectMembers.Commands.AddProjectMember;
using TeamHub.Application.Projects.ProjectMembers.Commands.RemoveProjectMember;
using TeamHub.Application.Projects.ProjectMembers.Queries.GetAllMembersOfProject;
using TeamHub.Application.Projects.ProjectMembers.Queries.GetAllProjectsMembers;
using TeamHub.Application.Projects.Queries.GetAllProjects;
using TeamHub.Application.Projects.Queries.GetProjectById;
using TeamHub.Application.Projects.Queries.SearchProjectsByName;
using TeamHub.Application.Projects.Responses;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.PageSize;

namespace TeamHub.API.Controllers.Projects;

[ApiController]
[ApiVersion(ApiVersions.V1)]
[Route("api/v{version:apiVersion}/project")]
[Authorize]
public class ProjectsController : ApiController
{
    public ProjectsController(ISender sender) 
        : base(sender)
    {
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProjects(
        [FromQuery] QueryObject queryObject,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var query = new GetAllProjectsQuery(queryObject, userId.Value);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<ProjectResponse>>(
                result.Value,
                "Project fetched successfully"))
            : HandleFailure(result);
    }

    [HttpGet("{id:Guid}")]
    public async Task<IActionResult> GetProjectById(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var query = new GetProjectByIdQuery(id);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<ProjectResponse>(
                result.Value,
                "Fetching Project By Id is successfull."))
            : HandleFailure(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchProjectsByName(
    [FromQuery] SearchQueryObject queryObject,
    CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var query = new SearchProjectsByNameQuery(userId.Value, queryObject);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<ProjectResponse>>(
                result.Value, 
                "Projects fetched successfully"))
            : HandleFailure(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject(
        [FromBody] ProjectRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new CreateProjectCommand(
                userId.Value,
                request.Name,
                request.Description,
                request.Color);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<ProjectResponse>(
                result.Value,
                "Projects Create successfully"))
            : HandleFailure(result);
    }

    [HttpPut("{id:Guid}/details")]
    public async Task<IActionResult> UpdateProject(
        [FromRoute] Guid id,
        [FromBody] ProjectRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new UpdateProjectCommand(
            id,
            request.Name,
            request.Description,
            request.Color,
            userId.Value);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<ProjectResponse>(
                result.Value,
                "Project updated successfully"))
            : HandleFailure(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProject(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new DeleteProjectCommand(id, userId.Value);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
           ? Ok(new ApiResponse("The project was deleted successfully."))
           : HandleFailure(result);
    }

    [HttpGet("members")]
    public async Task<IActionResult> GetAllProjectMembers(
        [FromQuery] QueryObject queryObject,
        CancellationToken cancellationToken)
    {
        var query = new GetAllProjectsMembersQuery(queryObject);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<ProjectMemberResponse>>(
                result.Value,
                "Project Members fetched successfully"))
            : HandleFailure(result);
    }

    [HttpGet("{projectId:Guid}/members")]
    public async Task<IActionResult> GetAllMembersOfProject(
        [FromRoute] Guid projectId,
        [FromQuery] QueryObject queryObject,
        CancellationToken cancellationToken)
    {
        var query = new GetAllMembersOfProjectQuery(projectId, queryObject);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<ProjectMemberResponse>>(
                result.Value,
                "Project members fetched successfully"))
            : HandleFailure(result);
    }


    [HttpPost("{projectId:Guid}/members")]
    public async Task<IActionResult> AddProjectMembers(
    [FromRoute] Guid projectId,
    [FromBody] ProjectMemberRequest request,
    CancellationToken cancellationToken)
    {
        var command = new AddProjectMemberCommand(projectId, request.UserId);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<ProjectMemberResponse>(
                result.Value,
                "Member Added Successfully"))
            : HandleFailure(result);
    }

    [HttpDelete("{projectId:Guid}/members/{userId:Guid}")]
    public async Task<IActionResult> RemoveProjectMember(
        Guid projectId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        var command = new RemoveProjectMemberCommand(projectId, userId);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok("Member Removed Successfully")
            : HandleFailure(result);
    }

}
