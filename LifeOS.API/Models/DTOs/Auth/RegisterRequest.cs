using System.ComponentModel.DataAnnotations;

namespace LifeOS.API.Models.DTOs.Auth
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; } = string.Empty;

        public string? Username { get; set; }

        public string Role { get; set; } = "User";

        public string? Qualification { get; set; }

        public string? SecurityAnswer { get; set; }
    }
}
