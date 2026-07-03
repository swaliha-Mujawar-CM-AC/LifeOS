using System;
using System.ComponentModel.DataAnnotations;

namespace LifeOS.API.Models
{
    public class Notification
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Type of notification: CoachFeedback, CoachApplication, General
        /// </summary>
        [Required]
        [MaxLength(30)]
        public string Type { get; set; } = "General";

        /// <summary>
        /// Category context: Tasks, Habits, Finance, or empty
        /// </summary>
        [MaxLength(30)]
        public string Category { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
