using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using VideoService;
using VideoService.Helpers;
using VideoService.Interfaces;
using VideoService.Models;
using VideoService.Services;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options =>
{
    options.Configure(builder.Configuration.GetSection("Kestrel"));
});

builder.Services.AddDbContext<VideoServiceDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("VideoServiceContext") ?? throw new InvalidOperationException("Connection string 'CoursesServiceContext' not found.")));

//builder.Services.AddControllers();
builder.Services.AddGrpc();


builder.Services.AddSingleton<IVideoProcessor, VideoProcessor>()
                .AddSingleton<IS3StorageService, MinioService>();


builder.Services.Configure<MinIOSettings>(builder.Configuration.GetSection("MinIO"));
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowFrontend", policy =>
//    {
//        policy.WithOrigins("http://127.0.0.1:5500") // домен откуда отправляется форма/JS
//              .AllowAnyMethod()
//              .AllowAnyHeader()
//              .AllowCredentials(); // если нужны cookies
//    });
//});

//builder.Services.Configure<FormOptions>(options =>
//{
//    options.MultipartBodyLengthLimit = 1073741824; // 1 GB
//    options.ValueLengthLimit = int.MaxValue;
//    options.MemoryBufferThreshold = int.MaxValue;
//});

//// И в ConfigureServices (или Program.cs)
//builder.WebHost.ConfigureKestrel(serverOptions =>
//{
//    serverOptions.Limits.MaxRequestBodySize = 1073741824; // 1 GB
//});

var app = builder.Build();

//app.UseCors("AllowFrontend");
//app.MapControllers();

app.MapGrpcService<VideoProcessorService>();
app.MapGet("/", () => "Use gRPC client to communicate with this service.");


app.Run();
