using Microsoft.AspNetCore.Mvc;

namespace TeamHub.API.Controllers.Tasks.Requests;

public class UploadAttachmentRequest
{
    [FromForm(Name = "file")]
    public IFormFile File { get; set; } = default!;
}
