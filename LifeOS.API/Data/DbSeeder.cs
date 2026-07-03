using System;
using System.Collections.Generic;
using System.Linq;
using LifeOS.API.Models;

namespace LifeOS.API.Data
{
    public static class DbSeeder
    {
        public static void SeedData(ApplicationDbContext db)
        {
            // Check if we already seeded test data for john between June 20 and July 2
            DateTime startDate = new DateTime(2026, 6, 20);
            DateTime endDate = new DateTime(2026, 7, 3);
            
            bool alreadySeeded = db.Tasks.Any(t => t.UserId == 1 && t.Deadline >= startDate && t.Deadline <= endDate && t.Description.Contains("[Mock]"));
            if (alreadySeeded)
            {
                return;
            }

            var random = new Random();

            // 1. Seed Tasks
            var tasksToSeed = new List<TaskItem>();
            string[] priorities = { "High", "Medium", "Low" };
            string[] taskCategories = { "Career", "Personal", "Health", "Home", "Finance", "Other" };

            var taskTemplates = new[]
            {
                new { Title = "Workout Routine", Desc = "[Mock] Daily exercise session" },
                new { Title = "Read Book pages", Desc = "[Mock] Atomic habits or technical papers" },
                new { Title = "Prepare Presentation", Desc = "[Mock] Project slide deck prep" },
                new { Title = "Clean Room", Desc = "[Mock] Weekly organization" },
                new { Title = "Water Plants", Desc = "[Mock] Home gardening chore" },
                new { Title = "Code Refactoring", Desc = "[Mock] Core abstractions optimization" },
                new { Title = "Pay Bills", Desc = "[Mock] Electricity and broadband internet bills" },
                new { Title = "Review Team Code", Desc = "[Mock] PR approval session" },
                new { Title = "Cook Dinner", Desc = "[Mock] Healthy meal preparation" },
                new { Title = "Plan Budget", Desc = "[Mock] Track monthly savings and expenses" }
            };

            for (var dt = startDate; dt <= endDate; dt = dt.AddDays(1))
            {
                // Create 2 tasks per day
                for (int i = 0; i < 2; i++)
                {
                    var template = taskTemplates[random.Next(taskTemplates.Length)];
                    var isCompleted = random.Next(100) < 70; // 70% completion rate
                    var deadline = dt.AddHours(9 + random.Next(12));
                    
                    tasksToSeed.Add(new TaskItem
                    {
                        Title = $"{template.Title} - {dt:dd MMM}",
                        Description = template.Desc,
                        Deadline = deadline,
                        Priority = priorities[random.Next(priorities.Length)],
                        Category = taskCategories[random.Next(taskCategories.Length)],
                        IsCompleted = isCompleted,
                        CompletedAt = isCompleted ? deadline.AddMinutes(-random.Next(120)) : null,
                        UserId = 1
                    });
                }
            }
            db.Tasks.AddRange(tasksToSeed);

            // 2. Seed Habit Logs
            // Habits for john have IDs 1 to 9. Let's make logs for each day
            var logsToSeed = new List<HabitLog>();
            for (var dt = startDate; dt <= endDate; dt = dt.AddDays(1))
            {
                // Each day complete 3-6 random habits
                int countToLog = random.Next(3, 7);
                var habitIds = Enumerable.Range(1, 9).OrderBy(x => random.Next()).Take(countToLog).ToList();
                foreach (var hId in habitIds)
                {
                    // Check if already has a log on this date
                    bool exists = db.HabitLogs.Any(hl => hl.HabitId == hId && hl.CompletedDate == dt.Date);
                    if (!exists)
                    {
                        logsToSeed.Add(new HabitLog
                        {
                            HabitId = hId,
                            CompletedDate = dt.Date
                        });
                    }
                }
            }
            db.HabitLogs.AddRange(logsToSeed);

            // 3. Seed Expenses
            var expensesToSeed = new List<Expense>();
            var expenseTemplates = new[]
            {
                new { Desc = "[Mock] Organic Fruits & Veggies", Cat = "Food", MinAmt = 400, MaxAmt = 1200 },
                new { Desc = "[Mock] Netflix Subscription", Cat = "Entertainment", MinAmt = 499, MaxAmt = 499 },
                new { Desc = "[Mock] Gas Station Fuel", Cat = "Travel", MinAmt = 300, MaxAmt = 900 },
                new { Desc = "[Mock] Pharmacy Health Checkup", Cat = "Health", MinAmt = 250, MaxAmt = 850 },
                new { Desc = "[Mock] Uber Ride", Cat = "Travel", MinAmt = 150, MaxAmt = 450 },
                new { Desc = "[Mock] Weekly Grocery Run", Cat = "Food", MinAmt = 1500, MaxAmt = 3000 },
                new { Desc = "[Mock] Broadband Internet Broadband", Cat = "Bills", MinAmt = 799, MaxAmt = 799 },
                new { Desc = "[Mock] Electricity Bill", Cat = "Bills", MinAmt = 1200, MaxAmt = 2400 },
                new { Desc = "[Mock] Coffee with Friends", Cat = "Food", MinAmt = 180, MaxAmt = 480 },
                new { Desc = "[Mock] Tech Gadget - USB Cable", Cat = "Miscellaneous", MinAmt = 200, MaxAmt = 500 }
            };

            for (var dt = startDate; dt <= endDate; dt = dt.AddDays(1.5)) // roughly every 1-2 days
            {
                var template = expenseTemplates[random.Next(expenseTemplates.Length)];
                decimal amt = random.Next(template.MinAmt, template.MaxAmt + 1);
                
                expensesToSeed.Add(new Expense
                {
                    Description = template.Desc,
                    Amount = amt,
                    Type = "Expense",
                    Category = template.Cat,
                    Date = dt.AddHours(12),
                    UserId = 1
                });
            }
            db.Expenses.AddRange(expensesToSeed);

            // 4. Seed Decisions
            var decisionsToSeed = new List<Decision>();
            var decisionTemplates = new[]
            {
                new { Title = "Enroll in CDAC Course online", Desc = "[Mock] Decide whether to enroll in CDAC specialized software development program.", Pros = "Better tech stack knowledge, job references", Cons = "High fee, 6 months time commitment", Expected = "Learn fullstack web development and secure a developer job.", Actual = "Successfully learned modern stacks.", Lessons = "Investing in structured learning saves time compared to self-study.", Cat = "Career", Eval = true },
                new { Title = "Buy a Mechanical Keyboard", Desc = "[Mock] Purchase a custom key mechanical keyboard for coding comfort.", Pros = "Fewer typing errors, better ergonomics", Cons = "Expensive gadget cost", Expected = "Improve typing comfort during daily 8-hour sessions.", Actual = "Very satisfying feedback, typing speed increased.", Lessons = "High quality tools make daily work more pleasant and productive.", Cat = "Finance", Eval = true },
                new { Title = "Establish 7 Hours Sleep schedule", Desc = "[Mock] Standardize sleeping time to improve morning focus.", Pros = "More fresh mornings, stable sleep rhythm", Cons = "Must stop watching screen late night", Expected = "Feel fully rested and alert by 7 AM.", Actual = "Felt extremely fresh and focused throughout the day.", Lessons = "Consistency of sleep schedule dictates mental alertness.", Cat = "Lifestyle", Eval = true },
                new { Title = "Switch from Coffee to Green Tea", Desc = "[Mock] Reduce high caffeine intake by substituting morning coffee.", Pros = "Fewer heart rate spikes, smoother focus", Cons = "No strong caffeine rush", Expected = "Sustain energy without afternoon crashes.", Actual = "No crashes, stable focus throughout afternoon.", Lessons = "Gradual caffeine source transition works better than cold turkey.", Cat = "Health", Eval = true },
                new { Title = "Invest 10% in Mutual Funds", Desc = "[Mock] Direct excess savings towards standard index funds monthly.", Pros = "Long term compound return, automated system", Cons = "Short term capital lockup", Expected = "Generate stable long-term returns.", Actual = "", Lessons = "Automate investing to avoid emotion-driven trading.", Cat = "Finance", Eval = false }
            };

            foreach (var template in decisionTemplates)
            {
                decisionsToSeed.Add(new Decision
                {
                    Title = template.Title,
                    Description = template.Desc,
                    Pros = template.Pros,
                    Cons = template.Cons,
                    ExpectedOutcome = template.Expected,
                    ActualOutcome = template.Actual,
                    LessonsLearned = template.Lessons,
                    Category = template.Cat,
                    IsEvaluated = template.Eval,
                    UserId = 1
                });
            }
            db.Decisions.AddRange(decisionsToSeed);

            db.SaveChanges();
        }
    }
}
