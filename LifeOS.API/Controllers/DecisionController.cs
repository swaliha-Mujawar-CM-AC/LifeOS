using Microsoft.AspNetCore.Mvc;
using LifeOS.API.Models;
using LifeOS.API.Services;
using System.Threading.Tasks;

namespace LifeOS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DecisionController : ControllerBase
    {
        private readonly DecisionService _decisionService;

        public DecisionController(DecisionService decisionService)
        {
            _decisionService = decisionService;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserDecisions(int userId)
        {
            var decisions = await _decisionService.GetUserDecisionsAsync(userId);
            return Ok(decisions);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDecision([FromBody] Decision decision)
        {
            var created = await _decisionService.CreateDecisionAsync(decision);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDecision(int id, [FromBody] Decision updated)
        {
            var decision = await _decisionService.UpdateDecisionAsync(id, updated);
            if (decision == null) return NotFound();
            return Ok(decision);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDecision(int id)
        {
            var success = await _decisionService.DeleteDecisionAsync(id);
            if (!success) return NotFound();
            return Ok(new { message = "Decision deleted successfully" });
        }
    }
}
