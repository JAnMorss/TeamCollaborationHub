using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TeamHub.Domain.Users.Entities;

namespace TeamHub.Infrastructure.Configurations;

internal sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(x => x.Id);

        // Value Object mappings
        builder.OwnsOne(u => u.FirstName, fn =>
        {
            fn.Property(f => f.Value)
              .HasColumnName("FirstName")
              .IsRequired()
              .HasMaxLength(20);
        });

        builder.OwnsOne(u => u.LastName, ln =>
        {
            ln.Property(l => l.Value)
              .HasColumnName("LastName")
              .IsRequired()
              .HasMaxLength(15);
        });

        builder.OwnsOne(u => u.Email, e =>
        {
            e.Property(em => em.Value)
             .HasColumnName("Email")
             .IsRequired()
             .HasMaxLength(255);

            e.HasIndex(em => em.Value).IsUnique();
        });

        builder.OwnsOne(u => u.Avatar, a =>
        {
            a.Property(av => av.Value)
             .HasColumnName("Avatar")
             .HasMaxLength(500);
        });

        builder.OwnsOne(u => u.PasswordHash, ph =>
        {
            ph.Property(p => p.Value)
              .HasColumnName("PasswordHash")
              .IsRequired()
              .HasMaxLength(500);
        });

        // Primitive properties
        builder.Property(x => x.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(x => x.UpdatedAt);


        builder.Property(x => x.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(x => x.IdentityId)
            .HasMaxLength(255);

        // Relationships
        builder.HasMany(u => u.ProjectMemberships)
            .WithOne(pm => pm.User)
            .HasForeignKey(pm => pm.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.AssignedTasks)
            .WithOne(t => t.AssignedTo)
            .HasForeignKey(t => t.AssignedToId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(u => u.Notifications)
            .WithOne(n => n.User)
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);


        builder.Navigation(u => u.ProjectMemberships)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.Navigation(u => u.AssignedTasks)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.Navigation(u => u.Notifications)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

    }
}
