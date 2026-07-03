using System;
using System.ComponentModel.DataAnnotations;

namespace LifeOS.API.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public DateTime Deadline { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Priority { get; set; } = "Medium"; // Low, Medium, High
        
        [MaxLength(50)]
        public string Category { get; set; } = "Other"; // Career, Personal, Health, Home, Finance, Other
        
        public bool IsCompleted { get; set; } = false;
        
        public DateTime? CompletedAt { get; set; }
        
        public int UserId { get; set; }
        
        // Reminder flags
        public bool ReminderSent { get; set; } = false;
    }
}
