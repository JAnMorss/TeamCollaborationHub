namespace TeamHub.API.Controllers.Users.Requests;

public sealed record UserRequest(
    string FirstName, 
    string LastName, 
    string Email);
