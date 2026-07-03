using Microsoft.EntityFrameworkCore;
using LifeOS.API.Data;
using LifeOS.API.Models;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace LifeOS.API.Services
{
    public class DecisionService
    {
        private readonly ApplicationDbContext _context;

        public DecisionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Decision>> GetUserDecisionsAsync(int userId)
        {
            return await _context.Decisions
                .Where(d => d.UserId == userId)
                .ToListAsync();
        }

        public async Task<Decision> CreateDecisionAsync(Decision decision)
        {
            _context.Decisions.Add(decision);
            await _context.SaveChangesAsync();
            return decision;
        }

        public async Task<Decision?> UpdateDecisionAsync(int id, Decision updated)
        {
            var decision = await _context.Decisions.FindAsync(id);
            if (decision == null) return null;

            decision.Title = updated.Title;
            decision.Description = updated.Description;
            decision.Pros = updated.Pros;
            decision.Cons = updated.Cons;
            decision.ExpectedOutcome = updated.ExpectedOutcome;
            decision.ActualOutcome = updated.ActualOutcome;
            decision.LessonsLearned = updated.LessonsLearned;
            decision.IsEvaluated = updated.IsEvaluated;

            await _context.SaveChangesAsync();
            return decision;
        }

        public async Task<bool> DeleteDecisionAsync(int id)
        {
            var decision = await _context.Decisions.FindAsync(id);
            if (decision == null) return false;

            _context.Decisions.Remove(decision);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
