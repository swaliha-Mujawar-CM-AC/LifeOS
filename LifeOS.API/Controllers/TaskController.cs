using Microsoft.AspNetCore.Mvc;
using LifeOS.API.Models;
using LifeOS.API.Services;
using System.Threading.Tasks;

namespace LifeOS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TaskController(TaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserTasks(int userId)
        {
            var tasks = await _taskService.GetUserTasksAsync(userId);
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskItem task)
        {
            var created = await _taskService.CreateTaskAsync(task);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem updatedTask)
        {
            var task = await _taskService.UpdateTaskAsync(id, updatedTask);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPatch("{id}/toggle-complete")]
        public async Task<IActionResult> ToggleComplete(int id)
        {
            var task = await _taskService.ToggleCompleteAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var success = await _taskService.DeleteTaskAsync(id);
            if (!success) return NotFound();
            return Ok(new { message = "Task deleted successfully" });
        }
    }
}
