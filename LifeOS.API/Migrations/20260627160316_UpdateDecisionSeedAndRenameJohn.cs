using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LifeOS.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDecisionSeedAndRenameJohn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Decisions",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Budgets",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.InsertData(
                table: "Budgets",
                columns: new[] { "Id", "Amount", "CreatedAt", "Month", "UserId", "Year" },
                values: new object[] { 2, 25000m, new DateTime(2026, 5, 23, 0, 0, 0, 0, DateTimeKind.Utc), 5, 1, 2026 });

            migrationBuilder.UpdateData(
                table: "Decisions",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ActualOutcome", "Category", "Cons", "Description", "ExpectedOutcome", "LessonsLearned", "Pros", "Title" },
                values: new object[] { "Energy and mood improved significantly. I could focus better and got more done in less time.", "Health", "Less output at work", "I was working long hours and neglecting my health. Started feeling tired, unmotivated and mentally drained.", "I will have more energy, improve my focus and maintain long-term productivity.", "Health is the foundation of everything. Prioritizing it early leads to better results in all areas of life.", "More energy, better sleep", "Prioritize health over overtime work" });

            migrationBuilder.UpdateData(
                table: "Decisions",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ActualOutcome", "Category", "Cons", "Description", "ExpectedOutcome", "LessonsLearned", "Pros", "Title" },
                values: new object[] { "Glad I didn't buy it, money remained saved.", "Personal", "Missed out on fun gadget", "Tempted to buy a new tablet but didn't actually need it.", "More savings, no clutter", "Waiting helped me save money and avoid regret.", "Saved money", "Avoid impulse purchases on gadgets" });

            migrationBuilder.UpdateData(
                table: "Decisions",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ActualOutcome", "Category", "Cons", "Description", "ExpectedOutcome", "LessonsLearned", "Pros", "Title" },
                values: new object[] { "Acquired 90% syllabus coverage.", "Relationship", "FOMO", "Needed to study for CDAC exam, invited to a party.", "Complete study goals", "Protecting my time helped me focus on priorities.", "Better grades", "Say no to social event for study" });

            migrationBuilder.UpdateData(
                table: "Decisions",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "ActualOutcome", "Category", "Cons", "Description", "ExpectedOutcome", "IsEvaluated", "LessonsLearned", "Pros", "Title" },
                values: new object[] { "Felt organized and relaxed.", "Lifestyle", "Less sleep at night", "Waking up late made me rush through the day.", "Productive and calm mornings", true, "Mornings set the tone for a productive day.", "Relaxed morning", "Start a morning routine" });

            migrationBuilder.InsertData(
                table: "Decisions",
                columns: new[] { "Id", "ActualOutcome", "Category", "Cons", "Description", "ExpectedOutcome", "IsEvaluated", "LessonsLearned", "Pros", "Title", "UserId" },
                values: new object[] { 5, "Not evaluated yet.", "Finance", "Market volatility", "Deciding where to invest excess monthly savings.", "Consistent 8% annual return", false, "Long-term thinking beats short-term gains.", "Compounding growth", "Invest in long-term Index Fund", 1 });

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Date", "Description" },
                values: new object[] { new DateTime(2026, 6, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Monthly Budget Allocation" });

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Date", "Description" },
                values: new object[] { new DateTime(2026, 6, 21, 0, 0, 0, 0, DateTimeKind.Utc), "Groceries & Dinner" });

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Date", "Description" },
                values: new object[] { new DateTime(2026, 6, 22, 0, 0, 0, 0, DateTimeKind.Utc), "Electricity & Internet Bills" });

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 4,
                column: "Description",
                value: "Movie tickets & Popcorn");

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 5,
                column: "Description",
                value: "Uber & Train ticket");

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 6,
                column: "Date",
                value: new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 2,
                column: "HabitId",
                value: 1);

            migrationBuilder.InsertData(
                table: "HabitLogs",
                columns: new[] { "Id", "CompletedDate", "HabitId" },
                values: new object[,]
                {
                    { 3, new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc), 1 },
                    { 4, new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc), 1 },
                    { 5, new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), 1 },
                    { 6, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), 2 },
                    { 7, new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc), 2 },
                    { 8, new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc), 2 },
                    { 9, new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc), 2 },
                    { 10, new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), 2 }
                });

            migrationBuilder.UpdateData(
                table: "Habits",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "MaxStreak", "Streak" },
                values: new object[] { 7, 5 });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 1,
                column: "Deadline",
                value: new DateTime(2026, 6, 27, 22, 20, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 2,
                column: "Deadline",
                value: new DateTime(2026, 6, 28, 2, 10, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 3,
                column: "Deadline",
                value: new DateTime(2026, 7, 2, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 22, 2, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 22, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 23, 4, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 6,
                column: "CompletedAt",
                value: new DateTime(2026, 6, 24, 1, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 7,
                column: "CompletedAt",
                value: new DateTime(2026, 6, 24, 23, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 25, 22, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Username" },
                values: new object[] { new DateTime(2026, 6, 12, 0, 0, 0, 0, DateTimeKind.Utc), "john" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 2, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 13, 0, 0, 0, 0, DateTimeKind.Utc));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Budgets",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Decisions",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Decisions");

            migrationBuilder.UpdateData(
                table: "Budgets",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Decisions",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ActualOutcome", "Cons", "Description", "ExpectedOutcome", "LessonsLearned", "Pros", "Title" },
                values: new object[] { "Compile times reduced by half.", "Expensive", "Upgrading from 8GB RAM to 32GB RAM", "Increase productivity by 20%", "Upgrading tools is always a worthy investment.", "Faster compile times,Better multitasking", "Buy a new laptop" });

            migrationBuilder.UpdateData(
                table: "Decisions",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ActualOutcome", "Cons", "Description", "ExpectedOutcome", "LessonsLearned", "Pros", "Title" },
                values: new object[] { "Exercised 4 times a week regularly.", "Monthly membership cost", "Improve physical fitness", "Be consistent with workouts", "Financial commitment helps maintain consistency.", "Access to professional equipment,Structured workout environment", "Join gym membership" });

            migrationBuilder.UpdateData(
                table: "Decisions",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ActualOutcome", "Cons", "Description", "ExpectedOutcome", "LessonsLearned", "Pros", "Title" },
                values: new object[] { "Learned Vite + React hooks and styling.", "Steep learning curve initially", "Build modern interactive SPA frontends", "Build premium web dashboards", "Hands-on projects are the best way to learn.", "Component-based architecture,Rich ecosystem,Better job opportunities", "Start learning React" });

            migrationBuilder.UpdateData(
                table: "Decisions",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "ActualOutcome", "Cons", "Description", "ExpectedOutcome", "IsEvaluated", "LessonsLearned", "Pros", "Title" },
                values: new object[] { "", "Market volatility", "Long-term financial savings growth", "Achieve 8% annualized return", false, "", "Low fee,Diversification", "Invest in index funds" });

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Date", "Description" },
                values: new object[] { new DateTime(2026, 6, 21, 0, 0, 0, 0, DateTimeKind.Utc), "Monthly Budget" });

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Date", "Description" },
                values: new object[] { new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc), "Groceries & Dining out" });

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Date", "Description" },
                values: new object[] { new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc), "Electricity & Water Bills" });

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 4,
                column: "Description",
                value: "Movie & Concert Tickets");

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 5,
                column: "Description",
                value: "Cab & Metro fare");

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 6,
                column: "Date",
                value: new DateTime(2026, 6, 22, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 2,
                column: "HabitId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Habits",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "MaxStreak", "Streak" },
                values: new object[] { 5, 3 });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 1,
                column: "Deadline",
                value: new DateTime(2026, 6, 26, 21, 35, 20, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 2,
                column: "Deadline",
                value: new DateTime(2026, 6, 26, 23, 24, 54, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 3,
                column: "Deadline",
                value: new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 22, 19, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 23, 18, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 6,
                column: "CompletedAt",
                value: new DateTime(2026, 6, 24, 2, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 7,
                column: "CompletedAt",
                value: new DateTime(2026, 6, 24, 23, 50, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 24, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.InsertData(
                table: "Tasks",
                columns: new[] { "Id", "CompletedAt", "Deadline", "Description", "IsCompleted", "Priority", "ReminderSent", "Title", "UserId" },
                values: new object[,]
                {
                    { 9, new DateTime(2026, 6, 24, 16, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc), "xUnit tests", true, "Low", false, "Write initial unit tests", 1 },
                    { 10, new DateTime(2026, 6, 25, 1, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc), "Serilog setup", true, "Medium", false, "Configure logging middlewares", 1 }
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Username" },
                values: new object[] { new DateTime(2026, 6, 20, 0, 0, 0, 0, DateTimeKind.Utc), "john_user" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 10, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 21, 0, 0, 0, 0, DateTimeKind.Utc));
        }
    }
}
