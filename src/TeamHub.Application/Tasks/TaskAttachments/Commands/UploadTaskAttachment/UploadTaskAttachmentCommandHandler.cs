using TeamHub.Application.Tasks.Responses;
using TeamHub.Domain.TaskAttachments.Entity;
using TeamHub.Domain.TaskAttachments.Interface;
using TeamHub.Domain.TaskAttachments.ValueObjects;
using TeamHub.Domain.Tasks.Errors;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;
using TeamHub.SharedKernel.Storage;

namespace TeamHub.Application.Tasks.TaskAttachments.Commands.UploadTaskAttachment;

internal class UploadTaskAttachmentCommandHandler : ICommandHandler<UploadTaskAttachmentCommand, Result<TaskAttachmentResponse>>
{
    private readonly ITaskAttachmentRepository _attachmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBlobService _blobService;

    public UploadTaskAttachmentCommandHandler(
        ITaskAttachmentRepository attachmentRepository, 
        IUnitOfWork unitOfWork, 
        IBlobService blobService)
    {
        _attachmentRepository = attachmentRepository;
        _unitOfWork = unitOfWork;
        _blobService = blobService;
    }

    public async Task<Result<Result<TaskAttachmentResponse>>> Handle(
        UploadTaskAttachmentCommand request, 
        CancellationToken cancellationToken)
    {
        var task = await _attachmentRepository.GetByIdAsync(request.TaskId, cancellationToken);
        if (task is null)
            return Result.Failure<TaskAttachmentResponse>(TaskErrors.NotFound);

        using var stream = request.File.OpenReadStream();
        var blobId = await _blobService.UploadAsync(stream, request.File.ContentType, cancellationToken);

        var fileName = FileName.Create(request.File.FileName).Value;
        var filePath = FilePath.Create(blobId.ToString()).Value;
        var fileType = FileType.Create(request.File.ContentType).Value;
        var fileSize = FileSize.Create(request.File.Length).Value;

        var attachment = new TaskAttachment(
            Guid.NewGuid(),
            fileName,
            filePath,
            fileType,
            fileSize,
            DateTime.UtcNow,
            request.TaskId,
            request.UploadedById
        );

        await _attachmentRepository.AddAsync(attachment, cancellationToken);

        await _unitOfWork.SaveChangesAsync();

        var response = TaskAttachmentResponse.FromEntity(attachment);

        return Result.Success(response);
    }
}
