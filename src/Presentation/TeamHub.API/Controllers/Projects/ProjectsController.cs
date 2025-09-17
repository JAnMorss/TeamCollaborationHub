using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TeamHub.API.Abstractions;
using TeamHub.Application.Projects.Queries.GetAllProjects;
using TeamHub.Application.Projects.Queries.SearchProjectsByName;
using TeamHub.Application.Projects.Responses;
using TeamHub.Application.Users.Responses;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Helpers;
using TeamHub.SharedKernel.Application.PageSize;

namespace TeamHub.API.Controllers.Projects;

[Route("api/[controller]")]
[ApiController]
public class ProjectsController : ApiController
{
    public ProjectsController(ISender sender) 
        : base(sender)
    {
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAllProjects(
        [FromQuery] QueryObject queryObject,
        CancellationToken cancellationToken)
    {
        var query = new GetAllProjectsQuery(queryObject);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<ProjectResponse>>(
                result.Value,
                "Project fetched successfully"))
            : HandleFailure(result);
    }

    [Authorize]
    [HttpGet("search")]
    public async Task<IActionResult> SearchProjectsByName(
    [FromQuery] string name,
    [FromQuery] QueryObject queryObject,
    CancellationToken cancellationToken)
    {
        var query = new SearchProjectsByNameQuery(name, queryObject);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<ProjectResponse>>(
                result.Value, 
                "Projects fetched successfully"))
            : HandleFailure(result);
    }

}
