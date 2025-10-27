using TeamHub.Application.Tasks.Responses;
using TeamHub.Domain.TaskAttachments.Entity;
using TeamHub.Domain.TaskAttachments.Interface;
using TeamHub.Domain.TaskAttachments.ValueObjects;
using TeamHub.Domain.Tasks.Errors;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;
using TeamHub.SharedKernel.Storage;

namespace TeamHub.Application.Tasks.TaskAttachments.Commands.UploadTaskAttachment;

internal class UploadTaskAttachmentCommandHandler : ICommandHandler<UploadTaskAttachmentCommand, TaskAttachmentResponse>
{
    private readonly ITaskRepository _taskRepository;
    private readonly ITaskAttachmentRepository _attachmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBlobService _blobService;

    public UploadTaskAttachmentCommandHandler(
        ITaskRepository taskRepository,
        ITaskAttachmentRepository attachmentRepository,
        IUnitOfWork unitOfWork,
        IBlobService blobService)
    {
        _taskRepository = taskRepository;
        _attachmentRepository = attachmentRepository;
        _unitOfWork = unitOfWork;
        _blobService = blobService;
    }

    public async Task<Result<TaskAttachmentResponse>> Handle(
        UploadTaskAttachmentCommand request, 
        CancellationToken cancellationToken)
    {
        var task = await _taskRepository.GetByIdAsync(request.TaskId, cancellationToken);
        if (task is null)
            return Result.Failure<TaskAttachmentResponse>(TaskErrors.NotFound);

        using var stream = request.File.OpenReadStream();
        var blobId = await _blobService.UploadAsync(stream, request.File.ContentType, cancellationToken);

        var extension = Path.GetExtension(request.File.FileName)?
            .TrimStart('.')
            .ToLowerInvariant();

        var fileName = FileName.Create(request.File.FileName);
        if (fileName.IsFailure)
            return Result.Failure<TaskAttachmentResponse>(fileName.Error);

        var filePath = FilePath.Create(blobId.ToString());
        if (filePath.IsFailure)
            return Result.Failure<TaskAttachmentResponse>(filePath.Error);

        var fileType = FileType.Create(extension ?? string.Empty);
        if (fileType.IsFailure)
            return Result.Failure<TaskAttachmentResponse>(fileType.Error);

        var fileSize = FileSize.Create(request.File.Length);
        if (fileSize.IsFailure) 
            return Result.Failure<TaskAttachmentResponse>(fileSize.Error);

        var attachment = new TaskAttachment(
            Guid.NewGuid(),
            fileName.Value,
            filePath.Value,
            fileType.Value,
            fileSize.Value,
            DateTime.UtcNow,
            request.TaskId,
            request.UploadedById
        );

        await _attachmentRepository.AddAsync(attachment, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var response = TaskAttachmentResponse.FromEntity(attachment);

        return Result.Success(response);
    }
}
