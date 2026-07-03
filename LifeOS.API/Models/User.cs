using System;
using System.ComponentModel.DataAnnotations;

namespace LifeOS.API.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [MaxLength(100)]
        public string? Username { get; set; }
        
        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Role { get; set; } = "User"; // "User", "Coach", "Admin"

        public string? Qualification { get; set; }

        public bool IsApproved { get; set; } = true;

        public int? AssignedCoachId { get; set; }

        public string? SecurityAnswerHash { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
