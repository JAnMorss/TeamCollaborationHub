using MediatR;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using TeamHub.API.Abstractions;
using TeamHub.Application.Auth.Commands.Login;
using TeamHub.Application.Auth.Commands.Register;
using TeamHub.Application.Auth.Response;
using TeamHub.Application.Users.Responses;

namespace TeamHub.API.Controllers.Auth;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ApiController
{
    public AuthController(ISender sender)
        : base(sender)
    {
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var command = new RegisterCommand(
            request.FirstName,
            request.LastName,
            request.Email,
            request.Avatar,
            request.Password);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<AuthResponse>(
                    result.Value, 
                    "User registered successfully"
                ))
            : HandleFailure(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var command = new LoginCommand(request.Email, request.Password);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<AuthResponse>(
                    result.Value, 
                    "Login successful"
                ))
            : HandleFailure(result);
    }
}
