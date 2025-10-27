using Microsoft.AspNetCore.Http;
using TeamHub.Application.Tasks.Responses;
using TeamHub.SharedKernel.Application.Mediator.Command;

namespace TeamHub.Application.Tasks.TaskAttachments.Commands.UploadTaskAttachment;

public sealed record UploadTaskAttachmentCommand(
    Guid TaskId,
    Guid UploadedById,
    IFormFile File) : ICommand<TaskAttachmentResponse>;