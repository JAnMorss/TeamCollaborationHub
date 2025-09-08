using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.ProjectMembers.Entity;

namespace TeamHub.Infrastructure.Configurations;

public class ProjectMemberConfiguration : IEntityTypeConfiguration<ProjectMember>
{
    public void Configure(EntityTypeBuilder<ProjectMember> builder)
    {
        builder.ToTable("ProjectMembers");

        builder.HasKey(pm => pm.Id);

        // Properties
        builder.Property(pm => pm.ProjectId)
            .IsRequired();

        builder.Property(pm => pm.UserId)
            .IsRequired();

        builder.Property(pm => pm.Role)
            .HasConversion<string>() 
            .IsRequired();

        builder.Property(pm => pm.JoinedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        // Relationships
        builder.HasOne(pm => pm.Project)
            .WithMany(p => p.Members) 
            .HasForeignKey(pm => pm.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pm => pm.User)
            .WithMany(u => u.ProjectMemberships) 
            .HasForeignKey(pm => pm.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
