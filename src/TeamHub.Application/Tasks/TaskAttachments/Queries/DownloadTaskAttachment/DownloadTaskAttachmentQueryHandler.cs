using System.Net.Mail;
using TeamHub.Domain.TaskAttachments.Errors;
using TeamHub.Domain.TaskAttachments.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;
using TeamHub.SharedKernel.Storage;

namespace TeamHub.Application.Tasks.TaskAttachments.Queries.DownloadTaskAttachment;

public sealed class DownloadTaskAttachmentQueryHandler : ICommandHandler<DownloadTaskAttachmentQuery, FileResponse>
{
    private readonly ITaskAttachmentRepository _taskAttachmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBlobService _blobService;

    public DownloadTaskAttachmentQueryHandler(
        ITaskAttachmentRepository taskAttachmentRepository,
        IUnitOfWork unitOfWork,
        IBlobService blobService)
    {
        _taskAttachmentRepository = taskAttachmentRepository;
        _unitOfWork = unitOfWork;
        _blobService = blobService;
    }
    public async Task<Result<FileResponse>> Handle(DownloadTaskAttachmentQuery request, CancellationToken cancellationToken)
    {
        var taskAttachment = await _taskAttachmentRepository.GetByIdAsync(request.AttachmentId, cancellationToken);
        if (taskAttachment is null)
            return Result.Failure<FileResponse>(TaskAttachmentErrors.NotFound);

        var file = await _blobService.DownloadAsync(
            Guid.Parse(taskAttachment.FilePath.Value), 
            cancellationToken);
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var fileResponse = new FileResponse(
            file.Stream,
            file.ContentType,
            file.FileName);

        return Result.Success(fileResponse);
    }
}
