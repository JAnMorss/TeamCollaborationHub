using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TeamHub.EmailService.Abstractions;
using TeamHub.EmailService.Config;
using TeamHub.EmailService.Services;

namespace TeamHub.EmailService;

public static class DependencyInjection
{
    public static IServiceCollection AddEmailService(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<SmtpSettings>(configuration.GetSection("SmtpSettings"));

        services.AddTransient<IEmailSender, EmailSender>();
        return services;
    }
}
