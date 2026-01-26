using MediatR;
using TeamHub.Domain.ProjectMembers.Interface;
using TeamHub.Domain.Projects.Errors;
using TeamHub.Domain.Projects.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.Application.Projects.ProjectMembers.Commands.RemoveProjectMember;

public sealed class RemoveProjectMemberCommandHandler : ICommandHandler<RemoveProjectMemberCommand, Unit>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IProjectMemberRepository _projectMemberRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RemoveProjectMemberCommandHandler(
        IProjectRepository projectRepository,
        IProjectMemberRepository projectMemberRepository,
        IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository ?? throw new ArgumentNullException(nameof(projectRepository));
        _projectMemberRepository = projectMemberRepository ?? throw new ArgumentNullException(nameof(projectMemberRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task<Result<Unit>> Handle(
        RemoveProjectMemberCommand request,
        CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);
        if (project == null)
            return Result.Failure<Unit>(ProjectErrors.NotFound);

        var member = await _projectMemberRepository.GetByProjectAndUserIdAsync(
            request.ProjectId, request.UserId, cancellationToken);

        if (member == null)
            return Result.Failure<Unit>(ProjectErrors.MemberNotFound);

        project.RemoveMember(member.UserId);

        await _projectMemberRepository.DeleteAsync(member.Id, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(Unit.Value);
    }
}
