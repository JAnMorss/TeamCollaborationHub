using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using TeamHub.EmailService.Abstractions;
using TeamHub.EmailService.Config;

namespace TeamHub.EmailService.Services;

public class EmailSender : IEmailSender
{
    private readonly SmtpSettings _settings;

    public EmailSender(IOptions<SmtpSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        using var client = new SmtpClient(_settings.Server, _settings.Port)
        {
            Credentials = new NetworkCredential(_settings.SenderEmail, _settings.Password),
            EnableSsl = true
        };

        var mail = new MailMessage
        {
            From = new MailAddress(_settings.SenderEmail, _settings.SenderName),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };
        mail.To.Add(to);

        await client.SendMailAsync(mail);
    }
}
