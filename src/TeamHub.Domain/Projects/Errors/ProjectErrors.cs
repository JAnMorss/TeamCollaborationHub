using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.Projects.Errors;

public static class ProjectErrors
{
    public static readonly Error NotFound = new(
        "Project.NotFound",
        "The Project with the specified identifier was not found.");

    public static readonly Error AlreadyMember = new(
        "Project.AlreadyMember",
        "User is already a member of this project.");

    public static readonly Error MemberNotFound = new(
        "Project.MemberNotFound",
        "The specified member was not found in this project.");

    public static readonly Error NoChanges = new(
        "Project.NoChanges",
        "No changes were detected in the update operation.");

    public static readonly Error AlreadyArchived = new(
        "Project.AlreadyArchived",
        "The project is already archived.");

    public static readonly Error NoMembers = new(
    "Project.NoMembers",
    "This project has no members. Please add a member.");

    public static readonly Error EmptyCategory = new(
        "Project.Empty",
        "Your project list is empty. Please create a category first");

}
