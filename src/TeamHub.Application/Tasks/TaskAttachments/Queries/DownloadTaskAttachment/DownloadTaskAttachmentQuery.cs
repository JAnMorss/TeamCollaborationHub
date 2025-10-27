using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.Storage;

namespace TeamHub.Application.Tasks.TaskAttachments.Queries.DownloadTaskAttachment;

public sealed record DownloadTaskAttachmentQuery(Guid AttachmentId) : ICommand<FileResponse>;
