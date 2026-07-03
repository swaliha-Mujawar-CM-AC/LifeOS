using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using LifeOS.API.Data;
using LifeOS.API.Models;
using LifeOS.API.Hubs;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace LifeOS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public FeedbackController(ApplicationDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromBody] CoachFeedback feedback)
        {
            feedback.CreatedAt = DateTime.UtcNow;
            _context.CoachFeedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            // Auto-create notification for the target user
            var coach = await _context.Users.FindAsync(feedback.CoachId);
            var notification = new Notification
            {
                UserId = feedback.UserId,
                Title = $"New feedback from Coach {coach?.Username ?? "Coach"}",
                Message = feedback.FeedbackText.Length > 100
                    ? feedback.FeedbackText.Substring(0, 100) + "..."
                    : feedback.FeedbackText,
                Type = "CoachFeedback",
                Category = feedback.Category,
                CreatedAt = DateTime.UtcNow
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Push real-time via SignalR
            await _hubContext.Clients.Group($"user_{feedback.UserId}").SendAsync("ReceiveNotification", new
            {
                notification.Id,
                notification.Title,
                notification.Message,
                notification.Type,
                notification.Category,
                notification.IsRead,
                notification.CreatedAt
            });

            return Ok(feedback);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserFeedback(int userId)
        {
            var feedbacks = await _context.CoachFeedbacks
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            var result = new System.Collections.Generic.List<object>();
            foreach (var f in feedbacks)
            {
                var coach = await _context.Users.FindAsync(f.CoachId);
                result.Add(new
                {
                    f.Id,
                    f.UserId,
                    f.CoachId,
                    CoachName = coach?.Username ?? "Coach",
                    f.FeedbackText,
                    f.Category,
                    f.CreatedAt
                });
            }

            return Ok(result);
        }

        /// <summary>
        /// Get feedback for a user filtered by category (Tasks/Habits/Finance)
        /// </summary>
        [HttpGet("user/{userId}/category/{category}")]
        public async Task<IActionResult> GetUserFeedbackByCategory(int userId, string category)
        {
            var feedbacks = await _context.CoachFeedbacks
                .Where(f => f.UserId == userId && f.Category == category)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            var result = new System.Collections.Generic.List<object>();
            foreach (var f in feedbacks)
            {
                var coach = await _context.Users.FindAsync(f.CoachId);
                result.Add(new
                {
                    f.Id,
                    f.UserId,
                    f.CoachId,
                    CoachName = coach?.Username ?? "Coach",
                    f.FeedbackText,
                    f.Category,
                    f.CreatedAt
                });
            }

            return Ok(result);
        }
    }
}
