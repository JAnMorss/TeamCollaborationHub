using TeamHub.Application.Projects.Responses;
using TeamHub.Domain.ProjectMembers.Enums;
using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Projects.ProjectMembers.Commands.AddProjectMember;

public sealed record AddProjectMemberCommand(
    Guid ProjectId,
    Guid UserId,
    ProjectRole Role = ProjectRole.Member
) : ICommand<ProjectMemberResponse>;