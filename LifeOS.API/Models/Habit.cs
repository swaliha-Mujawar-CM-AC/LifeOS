using System.ComponentModel.DataAnnotations;

namespace LifeOS.API.Models
{
    public class Habit
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        
        public int Streak { get; set; } = 0;
        
        public int MaxStreak { get; set; } = 0;
        
        public int UserId { get; set; }
    }
}
