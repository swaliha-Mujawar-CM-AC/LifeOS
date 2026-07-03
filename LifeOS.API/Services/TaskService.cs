using Microsoft.EntityFrameworkCore;
using LifeOS.API.Data;
using LifeOS.API.Models;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace LifeOS.API.Services
{
    public class TaskService
    {
        private readonly ApplicationDbContext _context;

        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TaskItem>> GetUserTasksAsync(int userId)
        {
            var tasks = await _context.Tasks
                .Where(t => t.UserId == userId)
                .ToListAsync();

            return tasks
                .OrderBy(t => t.IsCompleted)
                .ThenBy(t => t.Deadline)
                .ToList();
        }

        public async Task<TaskItem> CreateTaskAsync(TaskItem task)
        {
            task.ReminderSent = false;
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<TaskItem?> UpdateTaskAsync(int id, TaskItem updatedTask)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return null;

            task.Title = updatedTask.Title;
            task.Description = updatedTask.Description;
            task.Deadline = updatedTask.Deadline;
            task.Priority = updatedTask.Priority;
            
            if (task.IsCompleted != updatedTask.IsCompleted)
            {
                task.IsCompleted = updatedTask.IsCompleted;
                task.CompletedAt = task.IsCompleted ? DateTime.UtcNow : null;
            }
            
            if (task.Deadline != updatedTask.Deadline)
            {
                task.ReminderSent = false;
            }

            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<TaskItem?> ToggleCompleteAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return null;

            task.IsCompleted = !task.IsCompleted;
            task.CompletedAt = task.IsCompleted ? DateTime.UtcNow : null;
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
