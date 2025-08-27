using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel.Domain;

namespace TeamHub.Domain.TaskAttachments.Entity
{
    public sealed class TaskAttachment : BaseEntity
    {
        public TaskAttachment(
            Guid id, 
            string? fileName, 
            string? filePath, 
            string? fileType, 
            long fileSize, 
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

        public string? FileName { get; private set; }
        public string? FilePath { get; private set; }
        public string? FileType { get; private set; }
        public long FileSize { get; private set; }
        public DateTime UploadedAt { get; private set; }

        public Guid TaskId { get; private set; }
        public Guid UploadedById { get; private set; }

        public Task? Task { get; private set; }
        public User? UploadedBy { get; private set; }
    }
}
