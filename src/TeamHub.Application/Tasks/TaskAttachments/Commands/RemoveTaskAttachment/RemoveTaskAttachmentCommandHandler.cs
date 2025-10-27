using TeamHub.Domain.TaskAttachments.Errors;
using TeamHub.Domain.TaskAttachments.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;
using TeamHub.SharedKernel.Storage;

namespace TeamHub.Application.Tasks.TaskAttachments.Commands.RemoveTaskAttachment;

public sealed class RemoveTaskAttachmentCommandHandler : ICommandHandler<RemoveTaskAttachmentCommand>
{
    private readonly ITaskAttachmentRepository _taskAttachmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBlobService _blobService;

    public RemoveTaskAttachmentCommandHandler(
        ITaskAttachmentRepository taskAttachmentRepository,
        IUnitOfWork unitOfWork, 
        IBlobService blobService)
    {
        _taskAttachmentRepository = taskAttachmentRepository;
        _unitOfWork = unitOfWork;
        _blobService = blobService;
    }

    public async Task<Result> Handle(RemoveTaskAttachmentCommand request, CancellationToken cancellationToken)
    {
        var taskAttachment = await _taskAttachmentRepository.GetByIdAsync(request.AttachmentId, cancellationToken);
        if (taskAttachment is null)
            return Result.Failure(TaskAttachmentErrors.NotFound);

        await _blobService.DeleteAsync(
            Guid.Parse(taskAttachment.FilePath.Value), 
            cancellationToken);

        await _taskAttachmentRepository.DeleteAsync(taskAttachment.Id, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
