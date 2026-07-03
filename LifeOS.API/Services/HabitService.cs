using Microsoft.EntityFrameworkCore;
using LifeOS.API.Data;
using LifeOS.API.Models;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace LifeOS.API.Services
{
    public class HabitService
    {
        private readonly ApplicationDbContext _context;

        public HabitService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<object>> GetUserHabitsAsync(int userId)
        {
            var habits = await _context.Habits
                .Where(h => h.UserId == userId)
                .ToListAsync();

            var today = DateTime.UtcNow.Date;
            var habitIds = habits.Select(h => h.Id).ToList();
            
            int diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
            var startOfWeek = today.AddDays(-1 * diff).Date;
            var endOfWeek = startOfWeek.AddDays(6).Date;

            var logsThisWeek = await _context.HabitLogs
                .Where(l => habitIds.Contains(l.HabitId) && l.CompletedDate >= startOfWeek && l.CompletedDate <= endOfWeek)
                .ToListAsync();

            var result = habits.Select(h => {
                var completedDates = logsThisWeek
                    .Where(l => l.HabitId == h.Id)
                    .Select(l => l.CompletedDate.Date)
                    .ToList();
                
                var completedDaysOfWeek = new List<int>();
                for (int i = 0; i < 7; i++)
                {
                    var date = startOfWeek.AddDays(i);
                    if (completedDates.Contains(date))
                    {
                        completedDaysOfWeek.Add(i);
                    }
                }

                return new
                {
                    h.Id,
                    h.Title,
                    h.Streak,
                    h.MaxStreak,
                    h.UserId,
                    IsCompletedToday = completedDates.Contains(today),
                    CompletedDaysOfWeek = completedDaysOfWeek
                } as object;
            }).ToList();

            return result;
        }

        public async Task<Habit> CreateHabitAsync(Habit habit)
        {
            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();
            return habit;
        }

        public async Task<object?> ToggleLogAsync(int id)
        {
            var habit = await _context.Habits.FindAsync(id);
            if (habit == null) return null;

            var today = DateTime.UtcNow.Date;
            var existingLog = await _context.HabitLogs
                .FirstOrDefaultAsync(l => l.HabitId == id && l.CompletedDate == today);

            bool isCompletedToday;

            if (existingLog != null)
            {
                _context.HabitLogs.Remove(existingLog);
                
                if (habit.Streak > 0)
                {
                    habit.Streak--;
                }
                isCompletedToday = false;
            }
            else
            {
                var log = new HabitLog
                {
                    HabitId = id,
                    CompletedDate = today
                };
                _context.HabitLogs.Add(log);

                var yesterday = today.AddDays(-1);
                var completedYesterday = await _context.HabitLogs
                    .AnyAsync(l => l.HabitId == id && l.CompletedDate == yesterday);

                if (completedYesterday)
                {
                    habit.Streak++;
                }
                else
                {
                    habit.Streak = 1;
                }

                if (habit.Streak > habit.MaxStreak)
                {
                    habit.MaxStreak = habit.Streak;
                }
                isCompletedToday = true;
            }

            await _context.SaveChangesAsync();

            return new
            {
                habit.Id,
                habit.Title,
                habit.Streak,
                habit.MaxStreak,
                habit.UserId,
                IsCompletedToday = isCompletedToday
            };
        }

        public async Task<List<object>> GetLeaderboardAsync()
        {
            var users = await _context.Users
                .Where(u => u.Role == "User")
                .ToListAsync();
            var leaderboard = new List<object>();

            foreach (var user in users)
            {
                var habits = await _context.Habits.Where(h => h.UserId == user.Id).ToListAsync();
                var totalStreak = habits.Sum(h => h.Streak);
                var maxStreak = habits.Any() ? habits.Max(h => h.MaxStreak) : 0;
                var completedTodayCount = 0;

                if (habits.Any())
                {
                    var habitIds = habits.Select(h => h.Id).ToList();
                    completedTodayCount = await _context.HabitLogs
                        .CountAsync(l => habitIds.Contains(l.HabitId) && l.CompletedDate == DateTime.UtcNow.Date);
                }

                leaderboard.Add(new
                {
                    userId = user.Id,
                    username = user.Username,
                    totalStreakScore = totalStreak,
                    maxIndividualStreak = maxStreak,
                    completedToday = completedTodayCount,
                    totalHabits = habits.Count
                });
            }

            return leaderboard.OrderByDescending(l => ((dynamic)l).totalStreakScore).ToList();
        }

        public async Task<bool> DeleteHabitAsync(int id)
        {
            var habit = await _context.Habits.FindAsync(id);
            if (habit == null) return false;

            var logs = _context.HabitLogs.Where(l => l.HabitId == id);
            _context.HabitLogs.RemoveRange(logs);
            _context.Habits.Remove(habit);

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
