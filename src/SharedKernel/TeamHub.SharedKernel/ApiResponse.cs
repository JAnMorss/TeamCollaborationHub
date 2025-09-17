namespace TeamHub.SharedKernel;

public record ApiResponse<T>(T Data, string? Message);
public record ApiResponse(string? Message);

