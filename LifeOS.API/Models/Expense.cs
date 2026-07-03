using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeOS.API.Models
{
    public class Expense
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(150)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Amount { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Type { get; set; } = "Expense"; // Income, Expense, Savings, Investment
        
        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = "Other";
        
        [Required]
        public DateTime Date { get; set; }
        
        public int UserId { get; set; }
    }
}
