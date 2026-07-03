using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using LifeOS.API.Data;

namespace LifeOS.API.Services
{
    public class DeadlineReminderService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DeadlineReminderService> _logger;

        public DeadlineReminderService(IServiceProvider serviceProvider, ILogger<DeadlineReminderService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Deadline Reminder Background Service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckAndSendRemindersAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing reminder checks.");
                }

                // Check every 30 seconds
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }

            _logger.LogInformation("Deadline Reminder Background Service is stopping.");
        }

        private async Task CheckAndSendRemindersAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Find incomplete tasks that are due within the next 5 hours and haven't had a reminder sent yet
            var now = DateTime.UtcNow;
            var fiveHoursFromNow = now.AddHours(5);

            var pendingTasks = dbContext.Tasks
                .Where(t => !t.IsCompleted && !t.ReminderSent && t.Deadline > now && t.Deadline <= fiveHoursFromNow)
                .ToList();

            if (pendingTasks.Any())
            {
                foreach (var task in pendingTasks)
                {
                    // Fetch user details for the email/SMS target
                    var user = dbContext.Users.Find(task.UserId);
                    var userEmail = user?.Email ?? "user@lifeos.com";
                    var username = user?.Username ?? "User";

                    var timeRemaining = task.Deadline - now;

                    _logger.LogInformation("=========================================");
                    _logger.LogInformation($"[REMINDER DISPATCH] Sending Email & SMS to {username} ({userEmail})");
                    _logger.LogInformation($"Task: \"{task.Title}\" is due in {timeRemaining.Hours}h {timeRemaining.Minutes}m (Deadline: {task.Deadline})");
                    _logger.LogInformation("SMS: 'LifeOS: Alert! Your task is due in less than 5 hours. Get started!'");
                    _logger.LogInformation("=========================================");

                    // Mark as sent
                    task.ReminderSent = true;
                }

                await dbContext.SaveChangesAsync();
            }
        }
    }
}
