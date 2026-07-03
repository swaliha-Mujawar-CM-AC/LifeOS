using Microsoft.EntityFrameworkCore;
using LifeOS.API.Data;
using LifeOS.API.Models;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace LifeOS.API.Services
{
    public class ExpenseService
    {
        private readonly ApplicationDbContext _context;

        public ExpenseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Expense>> GetUserExpensesAsync(int userId)
        {
            return await _context.Expenses
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        public async Task<List<Expense>> GetUserExpensesByMonthAsync(int userId, int year, int month)
        {
            return await _context.Expenses
                .Where(e => e.UserId == userId && e.Date.Year == year && e.Date.Month == month && e.Type == "Expense")
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        public async Task<List<Expense>> GetUserExpensesByRangeAsync(int userId, DateTime from, DateTime to)
        {
            return await _context.Expenses
                .Where(e => e.UserId == userId && e.Date >= from && e.Date <= to)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        public async Task<Expense> CreateExpenseAsync(Expense expense)
        {
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        public async Task<Expense?> UpdateExpenseAsync(int id, Expense updates)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null) return null;

            expense.Description = updates.Category; // Frontend uses Category for Description
            expense.Amount = updates.Amount;
            expense.Category = updates.Category;
            expense.Date = updates.Date;

            await _context.SaveChangesAsync();
            return expense;
        }

        public async Task<bool> DeleteExpenseAsync(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null) return false;

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<object> GetBudgetAsync(int userId, int year, int month)
        {
            var budget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.UserId == userId && b.Year == year && b.Month == month);

            if (budget == null)
                return new { amount = 0m, exists = false };

            return new { budget.Id, budget.Amount, exists = true, budget.Year, budget.Month };
        }

        public async Task<Budget> SetBudgetAsync(Budget budget)
        {
            var existing = await _context.Budgets
                .FirstOrDefaultAsync(b => b.UserId == budget.UserId && b.Year == budget.Year && b.Month == budget.Month);

            if (existing != null)
            {
                existing.Amount = budget.Amount;
            }
            else
            {
                budget.CreatedAt = DateTime.UtcNow;
                _context.Budgets.Add(budget);
            }

            await _context.SaveChangesAsync();
            return existing ?? budget;
        }

        public async Task<object> GetSummaryAsync(int userId)
        {
            var items = await _context.Expenses
                .Where(e => e.UserId == userId)
                .ToListAsync();

            var totalIncome = items.Where(e => e.Type == "Income").Sum(e => e.Amount);
            var totalExpense = items.Where(e => e.Type == "Expense").Sum(e => e.Amount);
            var totalSavings = items.Where(e => e.Type == "Savings").Sum(e => e.Amount);
            var totalInvestment = items.Where(e => e.Type == "Investment").Sum(e => e.Amount);

            var categoryBreakdown = items
                .Where(e => e.Type == "Expense")
                .GroupBy(e => e.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Amount = g.Sum(e => e.Amount)
                })
                .ToList();

            var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
            var monthlyTrends = items
                .Where(e => e.Date >= sixMonthsAgo)
                .GroupBy(e => new { e.Date.Year, e.Date.Month })
                .Select(g => new
                {
                    Label = $"{g.Key.Month}/{g.Key.Year}",
                    Income = g.Where(e => e.Type == "Income").Sum(e => e.Amount),
                    Expense = g.Where(e => e.Type == "Expense").Sum(e => e.Amount),
                    Savings = g.Where(e => e.Type == "Savings").Sum(e => e.Amount),
                    Investment = g.Where(e => e.Type == "Investment").Sum(e => e.Amount),
                    SortKey = g.Key.Year * 100 + g.Key.Month
                })
                .OrderBy(t => t.SortKey)
                .ToList();

            return new
            {
                totalIncome,
                totalExpense,
                totalSavings,
                totalInvestment,
                netBalance = totalIncome - totalExpense - totalSavings - totalInvestment,
                categoryBreakdown,
                monthlyTrends
            };
        }

        public async Task<object> GetMonthlySummaryAsync(int userId, int year, int month)
        {
            var items = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date.Year == year && e.Date.Month == month && e.Type == "Expense")
                .ToListAsync();

            var totalExpense = items.Sum(e => e.Amount);

            var categoryBreakdown = items
                .GroupBy(e => e.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Amount = g.Sum(e => e.Amount)
                })
                .ToList();

            var budget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.UserId == userId && b.Year == year && b.Month == month);

            var budgetAmount = budget?.Amount ?? 0;
            var moneySaved = budgetAmount - totalExpense;

            return new
            {
                totalExpense,
                budgetAmount,
                moneySaved,
                categoryBreakdown
            };
        }
    }
}
