using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeOS.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthAndGlobalException : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Users",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldMaxLength: 100)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Budgets",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Budgets",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 26, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 1,
                column: "Date",
                value: new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 2,
                column: "Date",
                value: new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 3,
                column: "Date",
                value: new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 4,
                column: "Date",
                value: new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 5,
                column: "Date",
                value: new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Expenses",
                keyColumn: "Id",
                keyValue: 6,
                column: "Date",
                value: new DateTime(2026, 6, 29, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 29, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 4,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 5,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 6,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 7,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 29, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 8,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 9,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "HabitLogs",
                keyColumn: "Id",
                keyValue: 10,
                column: "CompletedDate",
                value: new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 1,
                column: "Deadline",
                value: new DateTime(2026, 6, 30, 22, 20, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 2,
                column: "Deadline",
                value: new DateTime(2026, 7, 1, 2, 10, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 3,
                column: "Deadline",
                value: new DateTime(2026, 7, 5, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 25, 2, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 26, 4, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 27, 1, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 27, 23, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 28, 22, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 29, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 15, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 5, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 16, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Username",
                keyValue: null,
                column: "Username",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Users",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldMaxLength: 100,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

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
                column: "Deadline",
                value: new DateTime(2026, 6, 28, 22, 20, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 2,
                column: "Deadline",
                value: new DateTime(2026, 6, 29, 2, 10, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 3,
                column: "Deadline",
                value: new DateTime(2026, 7, 3, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 23, 2, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 24, 4, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 24, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 25, 1, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 25, 23, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 26, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CompletedAt", "Deadline" },
                values: new object[] { new DateTime(2026, 6, 26, 22, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc) });

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
    }
}
