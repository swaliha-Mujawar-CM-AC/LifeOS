using System;
using System.ComponentModel.DataAnnotations;

namespace LifeOS.API.Models
{
    public class CoachFeedback
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int CoachId { get; set; }

        [Required]
        public string FeedbackText { get; set; } = string.Empty;

        /// <summary>
        /// Category: Tasks, Habits, Finance
        /// </summary>
        [MaxLength(30)]
        public string Category { get; set; } = "General";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
