namespace TeamHub.API.Controllers.Users;

public sealed record UserRequest(
    string FirstName, 
    string LastName, 
    string Email);
