namespace LifeOS.API.Models.DTOs.Auth
{
    public class AssignUserRequest
    {
        public int UserId { get; set; }
        public int? CoachId { get; set; }
    }

    public class ChangeRoleRequest
    {
        public string Role { get; set; } = string.Empty;
    }

    public class EditUserRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
