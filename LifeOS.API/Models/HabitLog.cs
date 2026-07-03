using System;

namespace LifeOS.API.Models
{
    public class HabitLog
    {
        public int Id { get; set; }
        
        public int HabitId { get; set; }
        
        public DateTime CompletedDate { get; set; }
    }
}
