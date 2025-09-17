using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TeamHub.Application.Abstractions;
using TeamHub.Domain.ProjectMembers.Interface;
using TeamHub.Domain.Projects.Interface;
using TeamHub.Domain.Tasks.Interface;
using TeamHub.Domain.Users.Interface;
using TeamHub.Infrastructure.Authentication;
using TeamHub.Infrastructure.Extensions;
using TeamHub.Infrastructure.Repositories;
using TeamHub.SharedKernel;

namespace TeamHub.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
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

        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

        services.AddJwtAuthentication(configuration);

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IProjectMemberRepository, ProjectMemberRepository>();
        services.AddScoped<ITaskRepository, TaskRepository>();

        services.AddScoped<IJwtProvider, JwtProvider>();

        return services;
    }
}