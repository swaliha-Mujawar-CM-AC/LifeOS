using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LifeOS.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Decisions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "varchar(250)", maxLength: 250, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Pros = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Cons = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExpectedOutcome = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ActualOutcome = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LessonsLearned = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsEvaluated = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Decisions", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Expenses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Description = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Type = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Category = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Expenses", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "HabitLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    HabitId = table.Column<int>(type: "int", nullable: false),
                    CompletedDate = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HabitLogs", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Habits",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Streak = table.Column<int>(type: "int", nullable: false),
                    MaxStreak = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Habits", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Deadline = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Priority = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsCompleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ReminderSent = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Decisions",
                columns: new[] { "Id", "ActualOutcome", "Cons", "Description", "ExpectedOutcome", "IsEvaluated", "LessonsLearned", "Pros", "Title", "UserId" },
                values: new object[,]
                {
                    { 1, "Compile times reduced by half.", "Expensive", "Upgrading from 8GB RAM to 32GB RAM", "Increase productivity by 20%", true, "Upgrading tools is always a worthy investment.", "Faster compile times,Better multitasking", "Buy a new laptop", 1 },
                    { 2, "Exercised 4 times a week regularly.", "Monthly membership cost", "Improve physical fitness", "Be consistent with workouts", true, "Financial commitment helps maintain consistency.", "Access to professional equipment,Structured workout environment", "Join gym membership", 1 },
                    { 3, "Learned Vite + React hooks and styling.", "Steep learning curve initially", "Build modern interactive SPA frontends", "Build premium web dashboards", true, "Hands-on projects are the best way to learn.", "Component-based architecture,Rich ecosystem,Better job opportunities", "Start learning React", 1 },
                    { 4, "", "Market volatility", "Long-term financial savings growth", "Achieve 8% annualized return", false, "", "Low fee,Diversification", "Invest in index funds", 1 }
                });

            migrationBuilder.InsertData(
                table: "Expenses",
                columns: new[] { "Id", "Amount", "Category", "Date", "Description", "Type", "UserId" },
                values: new object[,]
                {
                    { 1, 20000m, "Job", new DateTime(2026, 6, 21, 0, 0, 0, 0, DateTimeKind.Utc), "Monthly Budget", "Income", 1 },
                    { 2, 3927m, "Food & Dining", new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc), "Groceries & Dining out", "Expense", 1 },
                    { 3, 2887.50m, "Bills & Utilities", new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc), "Electricity & Water Bills", "Expense", 1 },
                    { 4, 1963.50m, "Entertainment", new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Movie & Concert Tickets", "Expense", 1 },
                    { 5, 1732.50m, "Transport", new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc), "Cab & Metro fare", "Expense", 1 },
                    { 6, 1039.50m, "Others", new DateTime(2026, 6, 22, 0, 0, 0, 0, DateTimeKind.Utc), "Miscellaneous purchases", "Expense", 1 }
                });

            migrationBuilder.InsertData(
                table: "HabitLogs",
                columns: new[] { "Id", "CompletedDate", "HabitId" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc), 1 },
                    { 2, new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc), 2 }
                });

            migrationBuilder.InsertData(
                table: "Habits",
                columns: new[] { "Id", "MaxStreak", "Streak", "Title", "UserId" },
                values: new object[,]
                {
                    { 1, 10, 5, "Exercise", 1 },
                    { 2, 5, 3, "Reading", 1 },
                    { 3, 0, 0, "Meditation", 1 },
                    { 4, 0, 0, "Water Intake", 1 },
                    { 5, 0, 0, "No Sugar", 1 },
                    { 6, 0, 0, "Wake Up Early", 1 },
                    { 7, 0, 0, "Journaling", 1 },
                    { 8, 0, 0, "Skin Care", 1 },
                    { 9, 0, 0, "Study", 1 }
                });

            migrationBuilder.InsertData(
                table: "Tasks",
                columns: new[] { "Id", "Deadline", "Description", "IsCompleted", "Priority", "ReminderSent", "Title", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 6, 26, 21, 35, 20, 0, DateTimeKind.Utc), "Work", false, "High", false, "Project Presentation", 1 },
                    { 2, new DateTime(2026, 6, 26, 23, 24, 54, 0, DateTimeKind.Utc), "Personal", false, "Medium", false, "Gym Membership Renewal", 1 },
                    { 3, new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Atomic habits review", false, "Low", false, "Read 10 pages of book", 1 },
                    { 4, new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "EF Core setup", true, "Medium", false, "Refactor database migrations", 1 },
                    { 5, new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc), "Vite react setup", true, "High", false, "Setup Vite Frontend configuration", 1 },
                    { 6, new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc), "JWT logic", true, "High", false, "Implement user authentication", 1 },
                    { 7, new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc), "Figma draft", true, "Medium", false, "Design dashboard cards wireframe", 1 },
                    { 8, new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc), "CORS check", true, "Low", false, "Verify API CORS policies", 1 },
                    { 9, new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc), "xUnit tests", true, "Low", false, "Write initial unit tests", 1 },
                    { 10, new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc), "Serilog setup", true, "Medium", false, "Configure logging middlewares", 1 }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "PasswordHash", "Username" },
                values: new object[] { 1, "john@lifeos.com", "user123", "john_user" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Decisions");

            migrationBuilder.DropTable(
                name: "Expenses");

            migrationBuilder.DropTable(
                name: "HabitLogs");

            migrationBuilder.DropTable(
                name: "Habits");

            migrationBuilder.DropTable(
                name: "Tasks");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
