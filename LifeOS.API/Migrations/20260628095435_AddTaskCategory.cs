using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeOS.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Tasks",
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
                value: new DateTime(2026, 6, 21, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Budgets",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 24, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 1,
                column: "Date",
                value: new DateTime(2026, 6, 21, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 2,
                column: "Date",
                value: new DateTime(2026, 6, 22, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 3,
                column: "Date",
                value: new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 4,
                column: "Date",
                value: new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 5,
                column: "Date",
                value: new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 6,
                column: "Date",
                value: new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 4,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 5,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 6,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 7,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 8,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 9,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 10,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Category", "Deadline" },
                values: new object[] { "Other", new DateTime(2026, 6, 28, 22, 20, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Category", "Deadline" },
                values: new object[] { "Other", new DateTime(2026, 6, 29, 2, 10, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Category", "Deadline" },
                values: new object[] { "Other", new DateTime(2026, 7, 3, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Category", "CompletedAt", "Deadline" },
                values: new object[] { "Other", new DateTime(2026, 6, 23, 2, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Category", "CompletedAt", "Deadline" },
                values: new object[] { "Other", new DateTime(2026, 6, 24, 4, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Category", "CompletedAt", "Deadline" },
                values: new object[] { "Other", new DateTime(2026, 6, 25, 1, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Category", "CompletedAt", "Deadline" },
                values: new object[] { "Other", new DateTime(2026, 6, 25, 23, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Category", "CompletedAt", "Deadline" },
                values: new object[] { "Other", new DateTime(2026, 6, 26, 22, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 3, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Tasks");

            migrationBuilder.UpdateData(
                table: "Budgets",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Budgets",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 23, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 1,
                column: "Date",
                value: new DateTime(2026, 6, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 2,
                column: "Date",
                value: new DateTime(2026, 6, 21, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 3,
                column: "Date",
                value: new DateTime(2026, 6, 22, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 4,
                column: "Date",
                value: new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 5,
                column: "Date",
                value: new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc));

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
                column: "CompletedDate",
                value: new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 4,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 5,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 6,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 7,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 8,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 9,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 10,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc));

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
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 24, 1, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 24, 23, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc) });

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
                column: "CreatedAt",
                value: new DateTime(2026, 6, 12, 0, 0, 0, 0, DateTimeKind.Utc));

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
    }
}
