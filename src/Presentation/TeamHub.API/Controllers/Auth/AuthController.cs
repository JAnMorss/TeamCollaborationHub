using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TeamHub.API.Abstractions;
using TeamHub.API.Controllers.Auth.Requests;
using TeamHub.Application.Auth.Commands.ForgotPassword;
using TeamHub.Application.Auth.Commands.Login;
using TeamHub.Application.Auth.Commands.Register;
using TeamHub.Application.Auth.Commands.ResetPassword;
using TeamHub.Application.Auth.Response;
using TeamHub.Application.Users.Responses;
using TeamHub.SharedKernel;

namespace TeamHub.API.Controllers.Auth;

[ApiController]
[ApiVersion(ApiVersions.V1)]
[Route("api/v{version:apiVersion}/auth")]
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
            request.Password);

        var result = await _sender.Send(
            command, 
            cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<UserResponse>(
                    result.Value, 
                    "User registered successfully"))
            : HandleFailure(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var command = new LoginCommand(
            request.Email, 
            request.Password);

        var result = await _sender.Send(
            command, 
            cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<AuthResponse>(
                    result.Value, 
                    "Login successful"))
            : HandleFailure(result);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(
        [FromBody] ForgotPasswordRequest request,
        CancellationToken cancellationToken)
    {
        var command = new ForgotPasswordCommand(
            request.Email,
            request.ClientUrl);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("Password reset email sent successfully"))
            : HandleFailure(result);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordRequest request,
        CancellationToken cancellationToken)
    {
        var command = new ResetPasswordCommand(
            request.Email,
            request.Token,
            request.NewPassword);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("Password reset successfully"))
            : HandleFailure(result);
    }

}
