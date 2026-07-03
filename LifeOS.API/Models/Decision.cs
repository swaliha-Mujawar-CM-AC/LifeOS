using System.ComponentModel.DataAnnotations;

namespace LifeOS.API.Models
{
    public class Decision
    {
        public int Id { get; set; }
        
        [MaxLength(250)]
        public string Title { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        // Stored as comma-separated or newline-separated values
        public string Pros { get; set; } = string.Empty;
        
        public string Cons { get; set; } = string.Empty;
        
        public string ExpectedOutcome { get; set; } = string.Empty;
        
        public string ActualOutcome { get; set; } = string.Empty;
        
        public string LessonsLearned { get; set; } = string.Empty;
        
        public bool IsEvaluated { get; set; } = false;
        
        [MaxLength(50)]
        public string Category { get; set; } = "General";
        
        public int UserId { get; set; }
    }
}
