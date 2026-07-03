using System.ComponentModel.DataAnnotations;

namespace LifeOS.API.Models.DTOs.Auth
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Username or Email is required.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = string.Empty;
    }
}
