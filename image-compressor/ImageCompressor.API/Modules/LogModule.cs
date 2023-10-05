using Carter;
using ImageCompressor.API.Results;
using ImageCompressor.StorageLibrary.Constants;
using ImageCompressor.StorageLibrary.Services.Abstract;

namespace ImageCompressor.API.Modules;

public class LogModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/logs/images", async (IBlobStorage blobStorage) =>
        {
            var logs = await blobStorage.GetLogAsync(Logs.ImageCompressorLogs);

            return Result.Success(logs);
        });
    }
}