using Microsoft.AspNetCore.Mvc;
using LifeOS.API.Services;
using System.Threading.Tasks;

namespace LifeOS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;

        public DashboardController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetDashboardSummary(int userId)
        {
            var summary = await _dashboardService.GetDashboardSummaryAsync(userId);
            if (summary == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(summary);
        }
    }
}
