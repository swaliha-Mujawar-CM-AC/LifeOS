using Microsoft.AspNetCore.Mvc;
using LifeOS.API.Models;
using LifeOS.API.Services;
using System;
using System.Threading.Tasks;

namespace LifeOS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseController : ControllerBase
    {
        private readonly ExpenseService _expenseService;

        public ExpenseController(ExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserExpenses(int userId)
        {
            var expenses = await _expenseService.GetUserExpensesAsync(userId);
            return Ok(expenses);
        }

        [HttpGet("user/{userId}/{year}/{month}")]
        public async Task<IActionResult> GetUserExpensesByMonth(int userId, int year, int month)
        {
            var expenses = await _expenseService.GetUserExpensesByMonthAsync(userId, year, month);
            return Ok(expenses);
        }

        [HttpGet("user/{userId}/range")]
        public async Task<IActionResult> GetUserExpensesByRange(int userId, [FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var expenses = await _expenseService.GetUserExpensesByRangeAsync(userId, from, to);
            return Ok(expenses);
        }

        [HttpPost]
        public async Task<IActionResult> CreateExpense([FromBody] Expense expense)
        {
            var created = await _expenseService.CreateExpenseAsync(expense);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] Expense updates)
        {
            var updated = await _expenseService.UpdateExpenseAsync(id, updates);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var success = await _expenseService.DeleteExpenseAsync(id);
            if (!success) return NotFound();
            return Ok(new { message = "Transaction deleted successfully" });
        }

        [HttpGet("budget/{userId}/{year}/{month}")]
        public async Task<IActionResult> GetBudget(int userId, int year, int month)
        {
            var budget = await _expenseService.GetBudgetAsync(userId, year, month);
            return Ok(budget);
        }

        [HttpPost("budget")]
        public async Task<IActionResult> SetBudget([FromBody] Budget budget)
        {
            var saved = await _expenseService.SetBudgetAsync(budget);
            return Ok(saved);
        }

        [HttpGet("summary/{userId}")]
        public async Task<IActionResult> GetSummary(int userId)
        {
            var summary = await _expenseService.GetSummaryAsync(userId);
            return Ok(summary);
        }

        [HttpGet("summary/{userId}/{year}/{month}")]
        public async Task<IActionResult> GetMonthlySummary(int userId, int year, int month)
        {
            var summary = await _expenseService.GetMonthlySummaryAsync(userId, year, month);
            return Ok(summary);
        }
    }
}
