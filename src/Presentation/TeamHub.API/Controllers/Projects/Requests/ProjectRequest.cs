namespace TeamHub.API.Controllers.Projects.Requests
{
    public sealed record ProjectRequest(
        string Name,
        string Description,
        string Color);
}
