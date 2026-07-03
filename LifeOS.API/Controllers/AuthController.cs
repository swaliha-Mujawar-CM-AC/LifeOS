using LifeOS.API.Data;
using LifeOS.API.Models;
using LifeOS.API.Models.DTOs.Auth;
using LifeOS.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LifeOS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenService _jwtTokenService;

        public AuthController(ApplicationDbContext context, JwtTokenService jwtTokenService)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (emailExists)
            {
                return Conflict(new { message = "This email address is already registered. Please login or use a different email." });
            }

            var user = new User
            {
                Email = request.Email,
                Username = string.IsNullOrWhiteSpace(request.Username) ? request.Email.Split('@')[0] : request.Username,
                Role = request.Role,
                Qualification = request.Role == "Coach" ? request.Qualification : null,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                SecurityAnswerHash = !string.IsNullOrWhiteSpace(request.SecurityAnswer) ? BCrypt.Net.BCrypt.HashPassword(request.SecurityAnswer.Trim().ToLowerInvariant()) : null,
                CreatedAt = DateTime.UtcNow,
                IsApproved = request.Role != "Coach"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Seed default data for regular users to prevent empty dashboard
            if (user.Role == "User")
            {
                _context.Tasks.Add(new TaskItem { UserId = user.Id, Title = "Explore LifeOS", Description = "Check out your dashboard, habits, and expenses.", Priority = "High", Deadline = DateTime.UtcNow.AddDays(1) });
                _context.Habits.Add(new Habit { UserId = user.Id, Title = "Drink Water" });
                _context.Habits.Add(new Habit { UserId = user.Id, Title = "Read 10 pages" });
                _context.Decisions.Add(new Decision { UserId = user.Id, Title = "Start using LifeOS", Description = "I decided to organize my life.", ExpectedOutcome = "Better productivity and clearer goals.", Category = "Lifestyle" });
                await _context.SaveChangesAsync();
            }

            return StatusCode(201, new { message = "User registered successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == request.Username || u.Username == request.Username);
            
            if (user == null)
            {
                return Unauthorized(new { message = "No account found with this username or email address." });
            }

            bool isPasswordValid = false;
            try
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            }
            catch (BCrypt.Net.SaltParseException)
            {
                // Fallback for plain-text seeded passwords
                if (user.PasswordHash == request.Password)
                {
                    isPasswordValid = true;
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                    await _context.SaveChangesAsync();
                }
            }

            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Incorrect password. Please try again." });
            }

            var token = _jwtTokenService.GenerateToken(user);

            return Ok(new
            {
                message = "Login successful.",
                token = token,
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    username = user.Username,
                    role = user.Role,
                    assignedCoachId = user.AssignedCoachId
                }
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null)
            {
                return Unauthorized(new { message = "Incorrect email or security answer." });
            }

            if (string.IsNullOrWhiteSpace(user.SecurityAnswerHash))
            {
                return Unauthorized(new { message = "Security question was not set up for this account." });
            }

            var providedAnswer = request.SecurityAnswer.Trim().ToLowerInvariant();
            var isAnswerValid = BCrypt.Net.BCrypt.Verify(providedAnswer, user.SecurityAnswerHash);

            if (!isAnswerValid)
            {
                return Unauthorized(new { message = "Incorrect security answer." });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password reset successfully. You can now login with your new password." });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.Select(u => new {
                id = u.Id,
                username = u.Username,
                email = u.Email,
                role = u.Role,
                isApproved = u.IsApproved,
                assignedCoachId = u.AssignedCoachId,
                qualification = u.Qualification
            }).ToListAsync();
            return Ok(users);
        }

        [HttpGet("pending-coaches")]
        public async Task<IActionResult> GetPendingCoaches()
        {
            var pending = await _context.Users
                .Where(u => u.Role == "Coach" && !u.IsApproved)
                .Select(u => new {
                    id = u.Id,
                    username = u.Username,
                    email = u.Email,
                    qualification = u.Qualification
                })
                .ToListAsync();
            return Ok(pending);
        }

        [HttpPut("approve-coach/{id}")]
        public async Task<IActionResult> ApproveCoach(int id)
        {
            var coach = await _context.Users.FindAsync(id);
            if (coach == null || coach.Role != "Coach") return NotFound(new { message = "Coach not found." });

            coach.IsApproved = true;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Coach approved successfully." });
        }

        [HttpPut("assign-user")]
        public async Task<IActionResult> AssignUser([FromBody] AssignUserRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) return NotFound(new { message = "User not found." });

            user.AssignedCoachId = request.CoachId;
            await _context.SaveChangesAsync();
            return Ok(new { message = "User assigned successfully." });
        }

        [HttpPut("change-role/{id}")]
        public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            user.Role = request.Role;
            if (request.Role == "Coach") user.IsApproved = false; // Require re-approval for safety
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "Role updated successfully." });
        }

        [HttpPut("edit-user/{id}")]
        public async Task<IActionResult> EditUser(int id, [FromBody] EditUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            // Check if email or username is taken by another user
            if (await _context.Users.AnyAsync(u => u.Email == request.Email && u.Id != id))
                return Conflict(new { message = "Email is already taken." });

            user.Username = request.Username;
            user.Email = request.Email;
            await _context.SaveChangesAsync();
            return Ok(new { message = "User updated successfully." });
        }

        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "User deleted successfully." });
        }

        [HttpGet("assigned-users/{coachId}")]
        public async Task<IActionResult> GetAssignedUsers(int coachId)
        {
            var users = await _context.Users
                .Where(u => u.AssignedCoachId == coachId)
                .Select(u => new {
                    id = u.Id,
                    username = u.Username,
                    email = u.Email
                })
                .ToListAsync();
            return Ok(users);
        }
    }
}
