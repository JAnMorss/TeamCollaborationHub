using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TeamHub.Domain.Messages.Entity;
using TeamHub.Domain.Users.Entities;
using TeamHub.Domain.Tasks.Entity;

namespace TeamHub.Infrastructure.Configurations;

internal sealed class ChatMessageConfiguration : IEntityTypeConfiguration<ChatMessage>
{
    public void Configure(EntityTypeBuilder<ChatMessage> builder)
    {
        builder.ToTable("ChatMessages");

        builder.HasKey(cm => cm.Id);

        builder.Property(cm => cm.Content)
               .IsRequired()
               .HasMaxLength(1000);

        builder.Property(cm => cm.CreateAt)
               .IsRequired()
               .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(cm => cm.TaskId)
               .IsRequired();

        builder.Property(cm => cm.SenderId)
               .IsRequired();

        builder.HasOne<ProjectTask>()
               .WithMany()
               .HasForeignKey(cm => cm.TaskId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<User>()
               .WithMany()
               .HasForeignKey(cm => cm.SenderId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}