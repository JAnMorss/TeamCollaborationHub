using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Domain.ProjectMembers.Errors;

public static class ProjectMemberErrors
{
    public static readonly Error NotFound = new(
        "ProjectMember.NotFound",
        "The Project Member with the specified identifier was not found.");
}
