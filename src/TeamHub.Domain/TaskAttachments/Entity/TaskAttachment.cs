using Microsoft.VisualBasic.FileIO;
using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.TaskAttachments.Entity
{
    public sealed class TaskAttachment : BaseEntity
    {
        public TaskAttachment(
            Guid id,
            FileName? fileName,
            FilePath? filePath,
            FileType? fileType,
            FileSize fileSize, 
            DateTime uploadedAt, 
            Guid taskId, 
            Guid uploadedById) : base(id)
        {
            FileName = fileName;
            FilePath = filePath;
            FileType = fileType;
            FileSize = fileSize;
            UploadedAt = uploadedAt;
            TaskId = taskId;
            UploadedById = uploadedById;
        }

        public FileName? FileName { get; private set; }
        public FilePath? FilePath { get; private set; }
        public FileType? FileType { get; private set; }
        public FileSize FileSize { get; private set; }
        public DateTime UploadedAt { get; private set; }

        public Guid TaskId { get; private set; }
        public Guid UploadedById { get; private set; }

        public Task? Task { get; private set; }
        public User? UploadedBy { get; private set; }
    }
}
