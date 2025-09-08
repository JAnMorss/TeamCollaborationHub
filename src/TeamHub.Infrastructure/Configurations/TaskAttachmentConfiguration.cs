using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TeamHub.Domain.TaskAttachments.Entity;

namespace TeamHub.Infrastructure.Configurations;

internal sealed class TaskAttachmentConfiguration : IEntityTypeConfiguration<TaskAttachment>
{
    public void Configure(EntityTypeBuilder<TaskAttachment> builder)
    {
        builder.ToTable("TaskAttachments");

        builder.HasKey(ta => ta.Id);

        // Value Objects
        builder.OwnsOne(ta => ta.FileName, fn =>
        {
            fn.Property(f => f.Value)
              .HasColumnName("FileName")
              .IsRequired()
              .HasMaxLength(255);
        });

        builder.OwnsOne(ta => ta.FilePath, fp =>
        {
            fp.Property(f => f.Value)
              .HasColumnName("FilePath")
              .IsRequired()
              .HasMaxLength(500);
        });

        builder.OwnsOne(ta => ta.FileType, ft =>
        {
            ft.Property(f => f.Value)
              .HasColumnName("FileType")
              .IsRequired()
              .HasMaxLength(50);
        });

        builder.OwnsOne(ta => ta.FileSize, fs =>
        {
            fs.Property(f => f.Value)
              .HasColumnName("FileSize")
              .IsRequired();
        });

        // Primitive properties
        builder.Property(ta => ta.UploadedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        // Relationships
        builder.HasOne(ta => ta.Task)
            .WithMany(t => t.Attachments) 
            .HasForeignKey(ta => ta.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ta => ta.UploadedBy)
            .WithMany() 
            .HasForeignKey(ta => ta.UploadedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
