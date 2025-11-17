using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TeamHub.Domain.Tasks.Entity;

namespace TeamHub.Infrastructure.Configurations;

internal sealed class ProjectTaskConfiguration : IEntityTypeConfiguration<ProjectTask>
{
    public void Configure(EntityTypeBuilder<ProjectTask> builder)
    {
        builder.ToTable("ProjectTasks");
        builder.HasKey(t => t.Id);

        // Value Objects
        builder.OwnsOne(t => t.Title, title =>
        {
            title.Property(t => t.Value)
                 .HasColumnName("Title")
                 .IsRequired()
                 .HasMaxLength(200);
        });

        builder.OwnsOne(t => t.Description, desc =>
        {
            desc.Property(d => d.Value)
                .HasColumnName("Description")
                .HasMaxLength(2000);
        });

        // Primitive properties
        builder.Property(t => t.Priority)
            .IsRequired();

        builder.Property(t => t.Status)
            .IsRequired();

        builder.Property(t => t.DueDate);

        builder.Property(t => t.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(t => t.UpdatedAt); 

        // Relationships
        builder.HasOne(t => t.Project)
            .WithMany(p => p.Tasks)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(t => t.AssignedTo)
            .WithMany(u => u.AssignedTasks)
            .HasForeignKey(t => t.AssignedToId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(t => t.CreatedBy)
            .WithMany()
            .HasForeignKey(t => t.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(t => t.Attachments)
            .WithOne(a => a.Task)
            .HasForeignKey(a => a.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(t => t.Attachments)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}