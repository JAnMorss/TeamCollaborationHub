using MediatR;
using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Projects.ProjectMembers.Commands.RemoveProjectMember;

public sealed record RemoveProjectMemberCommand(
    Guid ProjectId,
    Guid UserId
) : ICommand<Unit>;
