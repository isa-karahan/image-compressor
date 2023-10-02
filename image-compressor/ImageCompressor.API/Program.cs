using Carter;
using ImageCompressor.API.Hubs;
using ImageCompressor.StorageLibrary;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAzureStorageServices();

builder.Services.AddSignalR();
builder.Services.AddCarter();

builder.Services.AddCors();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(p => p.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials());

app.MapCarter();
app.MapHub<NotificationHub>("/api/hubs");

app.UseHttpsRedirection();

app.Run();