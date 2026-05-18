using CoursesService.Data;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);


// CORS
var corsOrigins = builder.Configuration.GetSection("CorsOrigins").Get<string[]>()
    ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


builder.Services.AddDbContext<CoursesService.Data.CourceServiceContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("CoursesServiceContext") ?? throw new InvalidOperationException("Connection string 'CoursesServiceContext' not found.")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Courses API",
        Version = "v1",
        Description = "API ��� ���������� ������� � �������"
    });
});

builder.Services.AddControllers();
builder.Services.AddGrpcClient<VideoService.Grpc.VideoService.VideoServiceClient>(o =>
{
    var url = builder.Configuration["VideoService:GrpcUrl"] ?? "http://localhost:8123";
    o.Address = new Uri(url);
});

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 1073741824; // 1 GB
    options.ValueLengthLimit = int.MaxValue;
    options.MemoryBufferThreshold = int.MaxValue;
});

// � � ConfigureServices (��� Program.cs)
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 1073741824; // 1 GB
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Courses API v1");
        c.RoutePrefix = string.Empty; 
    });
}

app.UseCors("FrontendPolicy");

app.MapControllers();
app.Run();
