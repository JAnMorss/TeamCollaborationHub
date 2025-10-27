using Microsoft.AspNetCore.Mvc;

namespace TeamHub.API.Controllers.Users;

public class UpdateAvatarRequest
{
    [FromForm(Name = "file")]
    public IFormFile File { get; set; } = default!;
}
