namespace TeamHub.Application.Users.Responses;

public record ApiResponse<T>(T Data, string? Message);
public record ApiResponse(string? Message);

