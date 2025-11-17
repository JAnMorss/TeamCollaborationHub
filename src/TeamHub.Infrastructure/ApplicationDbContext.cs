using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using TeamHub.Domain.Messages.Entity;
using TeamHub.Domain.Notifications.Entity;
using TeamHub.Domain.ProjectMembers.Entity;
using TeamHub.Domain.Projects.Entity;
using TeamHub.Domain.TaskAttachments.Entity;
using TeamHub.Domain.Tasks.Entity;
using TeamHub.Domain.Users.Entities;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Domain.Entities;

namespace TeamHub.Infrastructure;

public sealed class ApplicationDbContext : DbContext, IUnitOfWork
{
    private readonly IPublisher _publisher;
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IPublisher publisher) : base(options)
    {
        _publisher = publisher;
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectMember> ProjectMembers { get; set; }
    public DbSet<ProjectTask> Tasks { get; set; }
    public DbSet<TaskAttachment> TaskAttachments { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasMany(u => u.RefreshTokens)
            .WithOne(rt => rt.User)
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }


    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var result = await base.SaveChangesAsync(cancellationToken);
        await PublishDomainEventsAsync();
        return result;
    }

    private async Task PublishDomainEventsAsync()
    {
        var domainEvents = ChangeTracker
            .Entries<BaseEntity>()
            .Select(e => e.Entity)
            .SelectMany(entity =>
            {
                var events = entity.GetDomainEvents();
                entity.ClearDomainEvents();
                return events;
            })
            .ToList();

        foreach (var domainEvent in domainEvents)
        {
            await _publisher.Publish(domainEvent);
        }
    }

}