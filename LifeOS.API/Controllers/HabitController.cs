using Microsoft.AspNetCore.Mvc;
using LifeOS.API.Models;
using LifeOS.API.Services;
using System.Threading.Tasks;

namespace LifeOS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitController : ControllerBase
    {
        private readonly HabitService _habitService;

        public HabitController(HabitService habitService)
        {
            _habitService = habitService;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserHabits(int userId)
        {
            var result = await _habitService.GetUserHabitsAsync(userId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateHabit([FromBody] Habit habit)
        {
            var created = await _habitService.CreateHabitAsync(habit);
            return Ok(created);
        }

        [HttpPost("{id}/toggle-log")]
        public async Task<IActionResult> ToggleLog(int id)
        {
            var result = await _habitService.ToggleLogAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetLeaderboard()
        {
            var leaderboard = await _habitService.GetLeaderboardAsync();
            return Ok(leaderboard);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHabit(int id)
        {
            var success = await _habitService.DeleteHabitAsync(id);
            if (!success) return NotFound();
            return Ok(new { message = "Habit deleted" });
        }
    }
}
