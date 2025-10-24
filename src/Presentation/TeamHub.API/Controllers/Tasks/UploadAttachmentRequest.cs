using Microsoft.AspNetCore.Mvc;

namespace TeamHub.API.Controllers.Tasks;

public class UploadAttachmentRequest
{
    [FromForm(Name = "file")]
    public IFormFile File { get; set; } = default!;
}
