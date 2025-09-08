using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TeamHub.Domain.Projects.Entity;

namespace TeamHub.Infrastructure.Configurations;

internal sealed class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("Projects");

        builder.HasKey(p => p.Id);

        // Value Object mappings
        builder.OwnsOne(p => p.Name, n =>
        {
            n.Property(x => x.Value)
             .HasColumnName("Name")
             .IsRequired()
             .HasMaxLength(100);
        });

        builder.OwnsOne(p => p.Description, d =>
        {
            d.Property(x => x.Value)
             .HasColumnName("Description")
             .HasMaxLength(1000);
        });

        builder.OwnsOne(p => p.Color, c =>
        {
            c.Property(x => x.Value)
             .HasColumnName("Color")
             .HasMaxLength(20);
        });

        // Primitive properties
        builder.Property(p => p.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(p => p.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Relationships
        builder.HasOne(p => p.CreatedBy)
            .WithMany() 
            .HasForeignKey(p => p.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Members)
            .WithOne(m => m.Project)
            .HasForeignKey(m => m.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Tasks)
            .WithOne(t => t.Project)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        // Use backing fields for collections
        builder.Navigation(p => p.Members)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.Navigation(p => p.Tasks)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
