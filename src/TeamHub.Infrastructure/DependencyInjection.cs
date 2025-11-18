using Asp.Versioning;
using Azure.Storage.Blobs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TeamHub.Application.Abstractions;
using TeamHub.Domain.Messages.Interface;
using TeamHub.Domain.Notifications.Interface;
using TeamHub.Domain.ProjectMembers.Interface;
using TeamHub.Domain.Projects.Interface;
using TeamHub.Domain.TaskAttachments.Interface;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.Domain.Users.Interface;
using TeamHub.Infrastructure.Authentication;
using TeamHub.Infrastructure.Authentication.Extensions;
using TeamHub.Infrastructure.Repositories;
using TeamHub.Infrastructure.Storage;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Storage;
using TeamHub.SignalR.Interface;
using TeamHub.SignalR.Services;

namespace TeamHub.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        AddPersistence(services, configuration);

        AddAuthentication(services, configuration);

        AddApiVersioning(services);

        return services;
    }

    private static void AddPersistence(IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Database") ??
               throw new InvalidOperationException("Connection string 'Database' is missing in configuration.");

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseSqlServer(connectionString, sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(10),
                    errorNumbersToAdd: null
                );
            });
        });

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IProjectMemberRepository, ProjectMemberRepository>();
        services.AddScoped<ITaskRepository, TaskRepository>();
        services.AddScoped<ITaskAttachmentRepository, TaskAttachmentRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<IChatMessageRepository, ChatMessageRepository>();

        services.AddScoped<IBlobService, BlobService>();
        services.AddScoped<IAvatarBlobService, AvatarBlobService>();
        services.AddScoped(_ => new BlobServiceClient(configuration.GetConnectionString("BlobStorage")));
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IChatHubService, ChatHubService>();

    }

    private static void AddAuthentication(IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

        services.AddJwtAuthentication(configuration);

        services.AddScoped<IJwtProvider, JwtProvider>();
    }

    private static void AddApiVersioning(IServiceCollection services)
    {
        services
            .AddApiVersioning(static options =>
            {
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ReportApiVersions = true;
                options.ApiVersionReader = new UrlSegmentApiVersionReader();
            })
            .AddMvc()
            .AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'V";
                options.SubstituteApiVersionInUrl = true;
            });
    }

}