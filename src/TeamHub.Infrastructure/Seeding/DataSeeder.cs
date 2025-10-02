using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TeamHub.Domain.Users.Entities;
using TeamHub.Domain.Users.ValueObjects;

namespace TeamHub.Infrastructure.Seeding;

public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await context.Database.MigrateAsync();

        var adminEmail = "admin@teamhub.com";
        var adminPassword = "Admin@1234";
        var adminAvatar = "https://i.pravatar.cc/150?img=1";

        var existingAdmin = await context.Users.FirstOrDefaultAsync(u => u.Email.Value == adminEmail);
        if (existingAdmin == null)
        {
            var adminUserResult = User.Create(
                Guid.NewGuid(),
                "System",
                "Admin",
                adminEmail,
                adminAvatar,
                PasswordHash.FromPlainText(adminPassword).Value
            );

            if (adminUserResult.IsFailure)
                throw new Exception($"Admin creation failed: {adminUserResult.Error}");

            var adminUser = adminUserResult.Value;

            adminUser.PromoteToAdmin();

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();

            Console.WriteLine("✅ Default admin user created.");
        }
        else
        {
            Console.WriteLine("ℹ️ Admin user already exists. Skipping seeding.");
        }
    }
}
