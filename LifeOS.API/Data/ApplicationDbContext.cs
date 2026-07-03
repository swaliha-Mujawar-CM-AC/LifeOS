using Microsoft.EntityFrameworkCore;
using LifeOS.API.Models;
using System;

namespace LifeOS.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<Habit> Habits { get; set; }
        public DbSet<HabitLog> HabitLogs { get; set; }
        public DbSet<Decision> Decisions { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<CoachFeedback> CoachFeedbacks { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Budget> Budgets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            var today = DateTime.UtcNow.Date;
            var seedUserCreatedAt = today.AddDays(-15);

            // Rename default test user to "john"
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "john", Email = "john@lifeos.com", PasswordHash = "user123", Role = "User", IsApproved = true, AssignedCoachId = 2, CreatedAt = seedUserCreatedAt },
                new User { Id = 2, Username = "coach_bob", Email = "bob@lifeos.com", PasswordHash = "coach123", Role = "Coach", IsApproved = true, Qualification = "Certified Nutritionist & Personal Trainer", CreatedAt = seedUserCreatedAt.AddDays(-10) },
                new User { Id = 3, Username = "admin", Email = "admin@lifeos.com", PasswordHash = "admin123", Role = "Admin", IsApproved = true, CreatedAt = seedUserCreatedAt.AddDays(-30) }
            );

            // 1 Week of Task Data
            modelBuilder.Entity<TaskItem>().HasData(
                new TaskItem { Id = 1, Title = "Project Presentation", Description = "Work", Deadline = today.AddHours(22).AddMinutes(20), Priority = "High", IsCompleted = false, UserId = 1 },
                new TaskItem { Id = 2, Title = "Gym Membership Renewal", Description = "Personal", Deadline = today.AddHours(26).AddMinutes(10), Priority = "Medium", IsCompleted = false, UserId = 1 },
                new TaskItem { Id = 3, Title = "Read 10 pages of book", Description = "Atomic habits review", Deadline = today.AddDays(5), Priority = "Low", IsCompleted = false, UserId = 1 },
                new TaskItem { Id = 4, Title = "Refactor database migrations", Description = "EF Core setup", Deadline = today.AddDays(-5), Priority = "Medium", IsCompleted = true, CompletedAt = today.AddDays(-5).AddHours(2), UserId = 1 },
                new TaskItem { Id = 5, Title = "Setup Vite Frontend configuration", Description = "Vite react setup", Deadline = today.AddDays(-4), Priority = "High", IsCompleted = true, CompletedAt = today.AddDays(-4).AddHours(4), UserId = 1 },
                new TaskItem { Id = 6, Title = "Implement user authentication", Description = "JWT logic", Deadline = today.AddDays(-3), Priority = "High", IsCompleted = true, CompletedAt = today.AddDays(-3).AddHours(1), UserId = 1 },
                new TaskItem { Id = 7, Title = "Design dashboard cards wireframe", Description = "Figma draft", Deadline = today.AddDays(-2), Priority = "Medium", IsCompleted = true, CompletedAt = today.AddDays(-2).AddHours(-1), UserId = 1 },
                new TaskItem { Id = 8, Title = "Verify API CORS policies", Description = "CORS check", Deadline = today.AddDays(-1), Priority = "Low", IsCompleted = true, CompletedAt = today.AddDays(-1).AddHours(-2), UserId = 1 }
            );

            // Habits
            modelBuilder.Entity<Habit>().HasData(
                new Habit { Id = 1, Title = "Exercise", Streak = 5, MaxStreak = 10, UserId = 1 },
                new Habit { Id = 2, Title = "Reading", Streak = 5, MaxStreak = 7, UserId = 1 },
                new Habit { Id = 3, Title = "Meditation", Streak = 0, MaxStreak = 0, UserId = 1 },
                new Habit { Id = 4, Title = "Water Intake", Streak = 0, MaxStreak = 0, UserId = 1 },
                new Habit { Id = 5, Title = "No Sugar", Streak = 0, MaxStreak = 0, UserId = 1 },
                new Habit { Id = 6, Title = "Wake Up Early", Streak = 0, MaxStreak = 0, UserId = 1 },
                new Habit { Id = 7, Title = "Journaling", Streak = 0, MaxStreak = 0, UserId = 1 },
                new Habit { Id = 8, Title = "Skin Care", Streak = 0, MaxStreak = 0, UserId = 1 },
                new Habit { Id = 9, Title = "Study", Streak = 0, MaxStreak = 0, UserId = 1 }
            );

            // 1 Week of Habit Logs (to form a real 5-day streak!)
            modelBuilder.Entity<HabitLog>().HasData(
                new HabitLog { Id = 1, HabitId = 1, CompletedDate = today },
                new HabitLog { Id = 2, HabitId = 1, CompletedDate = today.AddDays(-1) },
                new HabitLog { Id = 3, HabitId = 1, CompletedDate = today.AddDays(-2) },
                new HabitLog { Id = 4, HabitId = 1, CompletedDate = today.AddDays(-3) },
                new HabitLog { Id = 5, HabitId = 1, CompletedDate = today.AddDays(-4) },
                new HabitLog { Id = 6, HabitId = 2, CompletedDate = today },
                new HabitLog { Id = 7, HabitId = 2, CompletedDate = today.AddDays(-1) },
                new HabitLog { Id = 8, HabitId = 2, CompletedDate = today.AddDays(-2) },
                new HabitLog { Id = 9, HabitId = 2, CompletedDate = today.AddDays(-3) },
                new HabitLog { Id = 10, HabitId = 2, CompletedDate = today.AddDays(-4) }
            );

            // 1 Week of Expenses Data
            modelBuilder.Entity<Expense>().HasData(
                new Expense { Id = 1, Description = "Monthly Budget Allocation", Amount = 20000, Type = "Income", Category = "Job", Date = today.AddDays(-7), UserId = 1 },
                new Expense { Id = 2, Description = "Groceries & Dinner", Amount = 3927, Type = "Expense", Category = "Food", Date = today.AddDays(-6), UserId = 1 },
                new Expense { Id = 3, Description = "Electricity & Internet Bills", Amount = 2887.50m, Type = "Expense", Category = "Bills", Date = today.AddDays(-5), UserId = 1 },
                new Expense { Id = 4, Description = "Movie tickets & Popcorn", Amount = 1963.50m, Type = "Expense", Category = "Entertainment", Date = today.AddDays(-4), UserId = 1 },
                new Expense { Id = 5, Description = "Uber & Train ticket", Amount = 1732.50m, Type = "Expense", Category = "Travel", Date = today.AddDays(-2), UserId = 1 },
                new Expense { Id = 6, Description = "Miscellaneous purchases", Amount = 1039.50m, Type = "Expense", Category = "Miscellaneous", Date = today.AddDays(-1), UserId = 1 }
            );

            // Monthly Budgets (June 2026 & May 2026)
            modelBuilder.Entity<Budget>().HasData(
                new Budget { Id = 1, UserId = 1, Year = 2026, Month = 6, Amount = 20000, CreatedAt = today.AddDays(-7) },
                new Budget { Id = 2, UserId = 1, Year = 2026, Month = 5, Amount = 25000, CreatedAt = today.AddDays(-35) }
            );

            // 1 Week of Decisions with Category tags
            modelBuilder.Entity<Decision>().HasData(
                new Decision { Id = 1, Title = "Prioritize health over overtime work", Description = "I was working long hours and neglecting my health. Started feeling tired, unmotivated and mentally drained.", Pros = "More energy, better sleep", Cons = "Less output at work", ExpectedOutcome = "I will have more energy, improve my focus and maintain long-term productivity.", ActualOutcome = "Energy and mood improved significantly. I could focus better and got more done in less time.", LessonsLearned = "Health is the foundation of everything. Prioritizing it early leads to better results in all areas of life.", IsEvaluated = true, Category = "Health", UserId = 1 },
                new Decision { Id = 2, Title = "Avoid impulse purchases on gadgets", Description = "Tempted to buy a new tablet but didn't actually need it.", Pros = "Saved money", Cons = "Missed out on fun gadget", ExpectedOutcome = "More savings, no clutter", ActualOutcome = "Glad I didn't buy it, money remained saved.", LessonsLearned = "Waiting helped me save money and avoid regret.", IsEvaluated = true, Category = "Personal", UserId = 1 },
                new Decision { Id = 3, Title = "Say no to social event for study", Description = "Needed to study for CDAC exam, invited to a party.", Pros = "Better grades", Cons = "FOMO", ExpectedOutcome = "Complete study goals", ActualOutcome = "Acquired 90% syllabus coverage.", LessonsLearned = "Protecting my time helped me focus on priorities.", IsEvaluated = true, Category = "Relationship", UserId = 1 },
                new Decision { Id = 4, Title = "Start a morning routine", Description = "Waking up late made me rush through the day.", Pros = "Relaxed morning", Cons = "Less sleep at night", ExpectedOutcome = "Productive and calm mornings", ActualOutcome = "Felt organized and relaxed.", LessonsLearned = "Mornings set the tone for a productive day.", IsEvaluated = true, Category = "Lifestyle", UserId = 1 },
                new Decision { Id = 5, Title = "Invest in long-term Index Fund", Description = "Deciding where to invest excess monthly savings.", Pros = "Compounding growth", Cons = "Market volatility", ExpectedOutcome = "Consistent 8% annual return", ActualOutcome = "Not evaluated yet.", LessonsLearned = "Long-term thinking beats short-term gains.", IsEvaluated = false, Category = "Finance", UserId = 1 }
            );
        }
    }
}