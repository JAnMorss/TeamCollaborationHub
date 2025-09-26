using MediatR;
using TeamHub.Domain.ProjectMembers.Interface;
using TeamHub.Domain.Projects.Errors;
using TeamHub.Domain.Projects.Interface;
using TeamHub.Domain.Users.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.Application.Projects.ProjectMembers.Commands.RemoveProjectMember;

public sealed class RemoveProjectMemberCommandHandler : ICommandHandler<RemoveProjectMemberCommand, Unit>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IProjectMemberRepository _projectMemberRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RemoveProjectMemberCommandHandler(
        IProjectRepository projectRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IProjectMemberRepository projectMemberRepository)
    {
        _projectRepository = projectRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _projectMemberRepository = projectMemberRepository;
    }
    public async Task<Result<Unit>> Handle(
        RemoveProjectMemberCommand request, 
        CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);
        if (project is null)
            return Result.Failure<Unit>(ProjectErrors.NotFound);

        var member = await _projectMemberRepository.FindAsync(
            request.ProjectId, 
            request.UserId, 
            cancellationToken);
        if (member is null)
            return Result.Failure<Unit>(ProjectErrors.NotFound);

        await _projectMemberRepository.DeleteAsync(member.Id, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(Unit.Value);
    }
}
