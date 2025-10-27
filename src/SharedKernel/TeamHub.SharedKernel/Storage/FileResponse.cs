namespace TeamHub.SharedKernel.Storage;

public record FileResponse(
    Stream Stream, 
    string ContentType, 
    string FileName);