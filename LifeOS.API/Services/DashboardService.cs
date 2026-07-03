using Microsoft.EntityFrameworkCore;
using LifeOS.API.Data;
using LifeOS.API.Models;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace LifeOS.API.Services
{
    public class DashboardService
    {
        private readonly ApplicationDbContext _context;

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<object?> GetDashboardSummaryAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;

            // 1. Task Stats & Upcoming Deadlines
            var tasks = await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
            var totalTasks = tasks.Count;
            var completedTasks = tasks.Count(t => t.IsCompleted);
            var pendingTasks = totalTasks - completedTasks;
            
            var now = DateTime.UtcNow;
            var upcomingTasks = tasks
                .Where(t => !t.IsCompleted && t.Deadline > now)
                .OrderBy(t => t.Deadline)
                .Take(3)
                .ToList();

            var overdueCount = tasks.Count(t => !t.IsCompleted && t.Deadline <= now);

            // 2. Habits Stats
            var habits = await _context.Habits.Where(h => h.UserId == userId).ToListAsync();
            var totalHabits = habits.Count;
            var bestStreak = habits.Any() ? habits.Max(h => h.Streak) : 0;
            var bestStreakName = habits.Any() ? habits.OrderByDescending(h => h.Streak).First().Title : "None";
            
            var habitIds = habits.Select(h => h.Id).ToList();
            var completedTodayCount = 0;
            if (habitIds.Any())
            {
                completedTodayCount = await _context.HabitLogs
                    .CountAsync(l => habitIds.Contains(l.HabitId) && l.CompletedDate == now.Date);
            }

            // 3. Finance Overview
            var financeItems = await _context.Expenses.Where(e => e.UserId == userId).ToListAsync();
            var totalIncome = financeItems.Where(e => e.Type == "Income").Sum(e => e.Amount);
            var totalExpense = financeItems.Where(e => e.Type == "Expense").Sum(e => e.Amount);
            var totalSavings = financeItems.Where(e => e.Type == "Savings").Sum(e => e.Amount);
            var totalInvestment = financeItems.Where(e => e.Type == "Investment").Sum(e => e.Amount);

            // --- SCORING CALCULATIONS ---

            // A. Habit Tracker scoring (Streak/Consistency)
            int activeDays = Math.Max(1, (DateTime.UtcNow.Date - user.CreatedAt.Date).Days + 1);
            int totalLogsCount = 0;
            if (habitIds.Any())
            {
                totalLogsCount = await _context.HabitLogs.CountAsync(l => habitIds.Contains(l.HabitId));
            }
            double habitScore = (totalHabits > 0 && activeDays > 0) 
                ? ((double)totalLogsCount / (totalHabits * activeDays)) * 100 
                : 0;
            habitScore = Math.Min(100.0, habitScore);

            // B. To-Do List scoring
            var evaluatedTasks = tasks.Where(t => t.IsCompleted || t.Deadline < DateTime.UtcNow).ToList();
            double totalTaskScore = 0;
            int evaluatedCount = 0;
            foreach (var t in evaluatedTasks)
            {
                evaluatedCount++;
                if (!t.IsCompleted)
                {
                    totalTaskScore += 0;
                }
                else
                {
                    var compTime = t.CompletedAt ?? DateTime.UtcNow;
                    if (compTime <= t.Deadline)
                    {
                        var margin = t.Deadline - compTime;
                        if (margin >= TimeSpan.FromHours(4))
                        {
                            totalTaskScore += 10;
                        }
                        else if (margin >= TimeSpan.FromMinutes(30))
                        {
                            totalTaskScore += 7;
                        }
                        else
                        {
                            totalTaskScore += 5;
                        }
                    }
                    else
                    {
                        totalTaskScore += 3;
                    }
                }
            }
            double taskScore = evaluatedCount > 0 ? (totalTaskScore / (evaluatedCount * 10)) * 100 : 0;

            // C. Financial Scoring (Savings Ratio)
            double financialScore = 0;
            if (totalIncome > 0)
            {
                double saved = (double)(totalIncome - totalExpense);
                financialScore = Math.Max(0, Math.Min(100, (saved / (double)totalIncome) * 100));
            }
            else
            {
                financialScore = 0;
            }

            // D. Combined Overall Score
            double overallScore = (habitScore + taskScore + financialScore) / 3.0;

            // 4. Generate Key Insights dynamically
            var insights = new List<string>();
            
            if (overdueCount > 0)
            {
                insights.Add($"⚠️ You have {overdueCount} overdue task(s). Prioritize them to clear your backlog!");
            }
            else if (pendingTasks == 0 && totalTasks > 0)
            {
                insights.Add("🎉 All tasks completed! You're fully caught up.");
            }
            else if (upcomingTasks.Any())
            {
                var nextTask = upcomingTasks.First();
                var remaining = nextTask.Deadline - now;
                insights.Add($"⏳ Next deadline: \"{nextTask.Title}\" is due in {remaining.Hours + (remaining.Days * 24)} hours.");
            }

            if (totalHabits > 0)
            {
                if (completedTodayCount == totalHabits)
                {
                    insights.Add("🔥 Outstanding! You've ticked off all your habits today.");
                }
                else if (completedTodayCount > 0)
                {
                    insights.Add($"📈 You've completed {completedTodayCount}/{totalHabits} habits today. Complete the rest to build consistency!");
                }
                else
                {
                    insights.Add("💡 Don't forget to track your habits today. Consistency is key to building streaks!");
                }
            }

            if (totalIncome > 0)
            {
                var expensePercent = (totalExpense / totalIncome) * 100;
                if (expensePercent > 80)
                {
                    insights.Add($"💸 Warning: You have spent {expensePercent:F0}% of your income. Consider reviewing your budget.");
                }
                else if (totalSavings > 0)
                {
                    var savingsPercent = (totalSavings / totalIncome) * 100;
                    insights.Add($"💰 Great job! You saved/invested {savingsPercent:F0}% of your income this month.");
                }
            }
            else if (totalExpense > 0)
            {
                insights.Add("📊 Track your income to see your net balance and savings rate.");
            }

            return new
            {
                username = user.Username,
                taskStats = new { totalTasks, completedTasks, pendingTasks, overdueCount },
                upcomingTasks,
                habitStats = new { totalHabits, completedTodayCount, bestStreak, bestStreakName },
                financeStats = new { totalIncome, totalExpense, totalSavings, totalInvestment, netBalance = totalIncome - totalExpense + totalSavings + totalInvestment },
                scores = new
                {
                    habitScore = Math.Round(habitScore),
                    taskScore = Math.Round(taskScore),
                    financialScore = Math.Round(financialScore),
                    overallScore = Math.Round(overallScore)
                },
                insights
            };
        }
    }
}
