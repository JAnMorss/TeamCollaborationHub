using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.Notifications.Entity;

namespace TeamHub.Infrastructure.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("Notifications");

        builder.HasKey(n => n.Id);

        // Value Objects
        builder.OwnsOne(n => n.Title, title =>
        {
            title.Property(t => t.Value)
                .HasColumnName("Title")
                .HasMaxLength(100)
                .IsRequired();
        });

        builder.OwnsOne(n => n.Message, message =>
        {
            message.Property(m => m.Value)
                .HasColumnName("Message")
                .HasMaxLength(500)
                .IsRequired();
        });

        builder.OwnsOne(n => n.ActionUrl, actionUrl =>
        {
            actionUrl.Property(a => a.Value)
                .HasColumnName("ActionUrl")
                .HasMaxLength(200);
        });

        builder.Property(n => n.Type)
            .HasConversion<string>() 
            .IsRequired();

        builder.Property(n => n.IsRead)
            .IsRequired();

        builder.Property(n => n.CreatedAt)
            .IsRequired();

        builder.Property(n => n.Time)
            .IsRequired();

        // Relationships
        builder.HasOne(n => n.User)
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Restrict); 

        builder.HasOne(n => n.Project)
            .WithMany()
            .HasForeignKey(n => n.ProjectId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(n => n.Task)
            .WithMany()
            .HasForeignKey(n => n.TaskId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(n => n.TriggeredBy)
            .WithMany()
            .HasForeignKey(n => n.TriggeredById)
            .OnDelete(DeleteBehavior.Restrict); 

    }
}
