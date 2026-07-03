using Microsoft.EntityFrameworkCore;
using LifeOS.API.Data;
using LifeOS.API.Services;
using LifeOS.API.Hubs;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure JWT Authentication
var jwtSecretKey = builder.Configuration["JwtSettings:SecretKey"] ?? "default_very_long_secret_key_that_needs_to_be_at_least_32_bytes";
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "LifeOS",
        ValidAudience = builder.Configuration["JwtSettings:Audience"] ?? "LifeOSClient",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
    };
});

builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<DashboardService>();
builder.Services.AddScoped<ExpenseService>();
builder.Services.AddScoped<TaskService>();
builder.Services.AddScoped<DecisionService>();
builder.Services.AddScoped<HabitService>();

// Configure MySQL Connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Add Background Services
builder.Services.AddHostedService<DeadlineReminderService>();

// SignalR for real-time notifications
builder.Services.AddSignalR();

// CORS configuration for React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.SetIsOriginAllowed(origin => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Required for SignalR
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

app.UseMiddleware<LifeOS.API.Middleware.GlobalExceptionMiddleware>();

// Seed mock database records on startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        LifeOS.API.Data.DbSeeder.SeedData(db);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"DB Seeding failed: {ex.Message}");
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactApp");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();
