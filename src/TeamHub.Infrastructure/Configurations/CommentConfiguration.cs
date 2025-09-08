using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TeamHub.Domain.Comments.Entity;

namespace TeamHub.Infrastructure.Configurations;

internal sealed class CommentConfiguration : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.ToTable("Comments");

        builder.HasKey(c => c.Id);

        // Value Object mapping 
        builder.OwnsOne(c => c.Content, ctn =>
        {
            ctn.Property(c => c.Value)
                .HasColumnName("Content")
                .IsRequired()
                .HasMaxLength(1000);
        });

        // Primitive properties
        builder.Property(c => c.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(c => c.UpdatedAt);

        builder.Property(c => c.IsEdited)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne(c => c.Author)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.Task)
            .WithMany(t => t.Comments)
            .HasForeignKey(c => c.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        // Navigation
        builder.Navigation(c => c.Author)
            .UsePropertyAccessMode(PropertyAccessMode.Property);

        builder.Navigation(c => c.Task)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
    }
}
