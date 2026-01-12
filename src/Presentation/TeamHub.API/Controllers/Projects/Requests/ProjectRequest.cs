namespace TeamHub.API.Controllers.Projects
{
    public sealed record ProjectRequest(
        string Name,
        string Description,
        string Color);
}
